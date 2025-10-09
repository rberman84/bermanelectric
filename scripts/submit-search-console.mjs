#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "node:crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountJson = process.env.GOOGLE_SEARCH_CONSOLE_SERVICE_ACCOUNT;
const siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL || "https://bermanelectrical.com";

if (!serviceAccountJson) {
  console.log("[search-console] GOOGLE_SEARCH_CONSOLE_SERVICE_ACCOUNT not set. Skipping submission.");
  process.exit(0);
}

const sitemapPath = path.resolve(process.cwd(), "public", "sitemap.xml");
if (!fs.existsSync(sitemapPath)) {
  console.log("[search-console] Sitemap not found at", sitemapPath);
  process.exit(0);
}

const loadCache = () => {
  const cachePath = path.join(__dirname, "search-console-cache.json");
  if (!fs.existsSync(cachePath)) {
    return { cachePath, urls: [] };
  }

  try {
    const data = fs.readFileSync(cachePath, "utf8");
    return { cachePath, urls: JSON.parse(data) };
  } catch (error) {
    console.warn("[search-console] Failed to read cache. Proceeding without cache.", error);
    return { cachePath, urls: [] };
  }
};

const saveCache = (cachePath, urls) => {
  try {
    fs.writeFileSync(cachePath, JSON.stringify(urls, null, 2));
  } catch (error) {
    console.warn("[search-console] Failed to persist cache", error);
  }
};

const parseSitemap = (xml) => {
  const matches = Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g));
  return matches.map((match) => match[1].trim());
};

const xml = fs.readFileSync(sitemapPath, "utf8");
const urls = parseSitemap(xml).filter((url) => url.startsWith(siteUrl));

if (urls.length === 0) {
  console.log("[search-console] No URLs found in sitemap for site", siteUrl);
  process.exit(0);
}

const { cachePath, urls: cachedUrls } = loadCache();
const cacheSet = new Set(cachedUrls);
const pendingUrls = urls.filter((url) => !cacheSet.has(url));

if (pendingUrls.length === 0) {
  console.log("[search-console] No new URLs to submit.");
  process.exit(0);
}

let credentials;
try {
  credentials = JSON.parse(serviceAccountJson);
} catch (error) {
  console.error("[search-console] Invalid service account JSON", error);
  process.exit(1);
}

const scope = "https://www.googleapis.com/auth/indexing";
const tokenEndpoint = "https://oauth2.googleapis.com/token";

const createSignedJwt = () => {
  const header = { alg: "RS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: credentials.client_email,
    scope,
    aud: tokenEndpoint,
    exp: now + 3600,
    iat: now,
  };

  const encode = (obj) => Buffer.from(JSON.stringify(obj)).toString("base64url");
  const input = `${encode(header)}.${encode(payload)}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(input);
  const signature = signer.sign(credentials.private_key, "base64url");
  return `${input}.${signature}`;
};

const getAccessToken = async () => {
  const assertion = createSignedJwt();
  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }).toString(),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Token exchange failed: ${response.status} ${body}`);
  }

  const json = await response.json();
  return json.access_token;
};

const publishUrl = async (accessToken, url) => {
  const response = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, type: "URL_UPDATED" }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Indexing API error ${response.status}: ${body}`);
  }
};

let accessToken;
try {
  accessToken = await getAccessToken();
} catch (error) {
  console.error("[search-console] Failed to obtain access token", error.message || error);
  process.exit(1);
}

console.log(`[search-console] Submitting ${pendingUrls.length} URL(s) to Google Indexing API...`);

for (const url of pendingUrls) {
  try {
    await publishUrl(accessToken, url);
    console.log(`[search-console] Submitted ${url}`);
    cacheSet.add(url);
  } catch (error) {
    console.error(`[search-console] Failed to submit ${url}`, error.message || error);
  }
}

saveCache(cachePath, Array.from(cacheSet));
