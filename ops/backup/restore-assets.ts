import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";
import { contentType } from "https://deno.land/std@0.224.0/media_types/mod.ts";

interface RestoreOptions {
  manifest: string;
  assets: string;
  onlyBuckets: string[];
}

interface ManifestObject {
  path: string;
  size: number;
  updated_at: string;
}

interface ManifestBucket {
  name: string;
  objects: ManifestObject[];
}

interface ManifestFile {
  buckets: ManifestBucket[];
}

function parseArgs(): RestoreOptions {
  const options: RestoreOptions = {
    manifest: "asset-manifest.json",
    assets: "assets",
    onlyBuckets: [],
  };

  for (let i = 0; i < Deno.args.length; i++) {
    const arg = Deno.args[i];
    if (arg === "--manifest") {
      options.manifest = Deno.args[++i];
    } else if (arg === "--assets") {
      options.assets = Deno.args[++i];
    } else if (arg === "--only-buckets") {
      const value = Deno.args[++i] ?? "";
      options.onlyBuckets = value.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }

  return options;
}

function ensureEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing env var ${name}`);
  return value;
}

async function uploadObject(
  supabase: ReturnType<typeof createClient>,
  bucket: string,
  object: ManifestObject,
  assetsDir: string,
) {
  const filePath = `${assetsDir}/${bucket}/${object.path}`;
  const fileData = await Deno.readFile(filePath);
  const ext = object.path.includes(".") ? object.path.substring(object.path.lastIndexOf(".") + 1) : "";
  const mime = contentType(ext) ?? "application/octet-stream";

  const { error } = await supabase.storage.from(bucket).upload(object.path, fileData, {
    upsert: true,
    contentType: mime,
  });

  if (error) {
    throw new Error(`Failed to upload ${bucket}/${object.path}: ${error.message}`);
  }
}

async function main() {
  const options = parseArgs();
  const supabaseUrl = ensureEnv("SUPABASE_URL");
  const serviceKey = ensureEnv("SUPABASE_SERVICE_ROLE_KEY");

  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const manifest: ManifestFile = JSON.parse(await Deno.readTextFile(options.manifest));

  const buckets = manifest.buckets.filter((bucket) =>
    options.onlyBuckets.length === 0 || options.onlyBuckets.includes(bucket.name)
  );

  for (const bucket of buckets) {
    console.log(`Restoring bucket ${bucket.name} (${bucket.objects.length} objects)...`);
    for (const object of bucket.objects) {
      try {
        await uploadObject(supabase, bucket.name, object, options.assets);
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  }

  console.log("Asset restore complete");
}

if (import.meta.main) {
  await main();
}
