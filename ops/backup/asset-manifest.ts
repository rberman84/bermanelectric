import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";
import { createHash } from "https://deno.land/std@0.224.0/hash/sha256.ts";

interface CliOptions {
  output: string;
  buckets: string[];
  download: boolean;
  downloadDir: string;
}

interface ManifestObject {
  path: string;
  size: number;
  updated_at: string;
  etag?: string;
  checksum?: string;
}

interface ManifestBucket {
  name: string;
  object_count: number;
  objects: ManifestObject[];
}

interface ManifestFile {
  generated_at: string;
  supabase_url: string;
  buckets: ManifestBucket[];
}

function parseArgs(): CliOptions {
  const options: CliOptions = {
    output: "asset-manifest.json",
    buckets: [],
    download: false,
    downloadDir: "assets",
  };

  for (let i = 0; i < Deno.args.length; i++) {
    const arg = Deno.args[i];
    if (arg === "--output") {
      options.output = Deno.args[++i];
    } else if (arg === "--buckets") {
      const value = Deno.args[++i] ?? "";
      options.buckets = value.split(",").map((s) => s.trim()).filter(Boolean);
    } else if (arg === "--download") {
      options.download = true;
    } else if (arg === "--download-dir") {
      options.downloadDir = Deno.args[++i];
    }
  }

  if (!options.output) {
    throw new Error("--output is required");
  }

  return options;
}

function ensureEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`Missing required env var ${name}`);
  }
  return value;
}

async function listAllObjects(
  supabase: ReturnType<typeof createClient>,
  bucket: string,
  prefix = "",
  download = false,
  downloadDir?: string,
): Promise<ManifestObject[]> {
  const results: ManifestObject[] = [];
  const limit = 1000;
  let offset = 0;

  while (true) {
    const { data, error } = await supabase.storage.from(bucket).list(prefix, {
      limit,
      offset,
      sortBy: { column: "name", order: "asc" },
    });

    if (error) {
      throw new Error(`Failed to list bucket ${bucket}: ${error.message}`);
    }

    if (!data || data.length === 0) {
      break;
    }

    offset += data.length;

    for (const entry of data) {
      const fullPath = prefix ? `${prefix}/${entry.name}` : entry.name;
      const isFolder = !entry.id;

      if (isFolder) {
        results.push(...await listAllObjects(supabase, bucket, fullPath, download, downloadDir));
        continue;
      }

    let checksum: string | undefined;
    let size = Number(entry.metadata?.size ?? entry.metadata?.ContentLength ?? entry.metadata?.content_length ?? 0);

    if (download) {
      const downloadResponse = await supabase.storage.from(bucket).download(fullPath);
      if (downloadResponse.error) {
        throw new Error(`Failed to download ${bucket}/${fullPath}: ${downloadResponse.error.message}`);
      }

      const arrayBuffer = await downloadResponse.data.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      if (size === 0) {
        size = bytes.byteLength;
      }

      const hash = createHash("sha256");
      hash.update(bytes);
      checksum = hash.toString();

      if (downloadDir) {
        const filePath = `${downloadDir}/${bucket}/${fullPath}`;
        const dirName = filePath.includes("/") ? filePath.substring(0, filePath.lastIndexOf("/")) : "";
        if (dirName) {
          await Deno.mkdir(dirName, { recursive: true });
        }
        await Deno.writeFile(filePath, bytes);
      }
    }

      results.push({
        path: fullPath,
        size,
        updated_at: entry.updated_at,
        etag: (entry as Record<string, unknown>).etag as string | undefined,
        checksum,
      });
    }
  }

  return results;
}

async function main() {
  const options = parseArgs();
  const supabaseUrl = ensureEnv("SUPABASE_URL");
  const serviceKey = ensureEnv("SUPABASE_SERVICE_ROLE_KEY");

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  const bucketsToProcess = options.buckets.length
    ? options.buckets
    : await (async () => {
      const { data, error } = await supabase.storage.listBuckets();
      if (error) throw error;
      return (data ?? []).map((bucket) => bucket.name);
    })();

  const manifest: ManifestFile = {
    generated_at: new Date().toISOString(),
    supabase_url: supabaseUrl,
    buckets: [],
  };

  if (options.download) {
    await Deno.mkdir(options.downloadDir, { recursive: true });
  }

  for (const bucket of bucketsToProcess) {
    const objects = await listAllObjects(supabase, bucket, "", options.download, options.downloadDir);
    manifest.buckets.push({
      name: bucket,
      object_count: objects.length,
      objects,
    });
  }

  await Deno.writeTextFile(options.output, JSON.stringify(manifest, null, 2));
  console.log(`Wrote manifest for ${manifest.buckets.length} buckets to ${options.output}`);
}

if (import.meta.main) {
  await main();
}
