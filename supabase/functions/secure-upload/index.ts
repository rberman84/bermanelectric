import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";
import { Image } from "https://deno.land/x/imagescript@1.2.15/mod.ts";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB cap
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "application/pdf",
]);

function detectMime(buffer: Uint8Array): string | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    buffer.length >= 4 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "image/png";
  }
  if (
    buffer.length >= 4 &&
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46
  ) {
    return "application/pdf";
  }
  return null;
}

async function stripMetadata(buffer: Uint8Array, mimeType: string): Promise<Uint8Array> {
  if (mimeType === "image/png") {
    const image = await Image.decode(buffer);
    return new Uint8Array(await image.encodePNG());
  }

  if (mimeType === "image/jpeg") {
    const image = await Image.decode(buffer);
    return new Uint8Array(await image.encodeJPEG(92));
  }

  return buffer;
}

function sanitizePathSegment(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function runMalwareScan(buffer: Uint8Array, fileName: string, mimeType: string) {
  const scanUrl = Deno.env.get("MALWARE_SCAN_URL");
  if (!scanUrl) {
    return;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/octet-stream",
    "x-file-name": fileName,
    "x-file-mime": mimeType,
  };

  const apiKey = Deno.env.get("MALWARE_SCAN_API_KEY");
  if (apiKey) {
    headers["x-api-key"] = apiKey;
  }

  const response = await fetch(scanUrl, {
    method: "POST",
    headers,
    body: buffer,
  });

  if (!response.ok) {
    throw new Error(`Malware scan failed (${response.status})`);
  }

  const result = await response.json();
  if (result?.clean === false || result?.malicious === true) {
    throw new Error("File failed malware scan");
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }

  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data")) {
    return new Response(
      JSON.stringify({ error: "Unsupported content type" }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }

  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return new Response(
        JSON.stringify({ error: "Missing file upload" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    if (file.size === 0) {
      return new Response(
        JSON.stringify({ error: "File is empty" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return new Response(
        JSON.stringify({ error: "File exceeds maximum size" }),
        { status: 413, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const originalBuffer = new Uint8Array(arrayBuffer);

    const detectedMime = detectMime(originalBuffer);
    if (!detectedMime) {
      return new Response(
        JSON.stringify({ error: "Unsupported file signature" }),
        { status: 415, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    if (!ALLOWED_MIME_TYPES.has(detectedMime)) {
      return new Response(
        JSON.stringify({ error: "File type is not allowed" }),
        { status: 415, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    if (file.type && file.type !== detectedMime) {
      return new Response(
        JSON.stringify({ error: "File type does not match content" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    const sanitizedBuffer = await stripMetadata(originalBuffer, detectedMime);
    await runMalwareScan(sanitizedBuffer, file.name, detectedMime);

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceKey) {
      console.error("Supabase credentials missing");
      return new Response(
        JSON.stringify({ error: "Storage backend not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });

    const bucket = Deno.env.get("UPLOAD_BUCKET") ?? "secure-uploads";
    const folder = form.get("folder")?.toString() ?? "";
    const safeFolder = folder
      .split("/")
      .map((segment) => sanitizePathSegment(segment))
      .filter(Boolean)
      .join("/");

    const safeName = sanitizePathSegment(file.name) || "file";
    const objectName = `${crypto.randomUUID()}-${safeName}`;
    const objectPath = safeFolder ? `${safeFolder}/${objectName}` : objectName;

    const { error: uploadError } = await supabase.storage.from(bucket).upload(objectPath, sanitizedBuffer, {
      contentType: detectedMime,
      upsert: false,
    });

    if (uploadError) {
      console.error("Failed to upload sanitized file", uploadError);
      return new Response(
        JSON.stringify({ error: "Failed to store file" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(objectPath);

    const responseBody = {
      ok: true,
      file: {
        bucket,
        path: objectPath,
        mimeType: detectedMime,
        size: sanitizedBuffer.byteLength,
        url: publicUrlData.publicUrl ?? null,
      },
    };

    return new Response(JSON.stringify(responseBody), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("secure-upload failure", error);
    const message = error instanceof Error ? error.message : "Unexpected error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }
});
