import { generateSitemaps } from './generate-sitemaps.mjs';

const pingGoogle = async (sitemapUrl) => {
  const endpoint = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
  try {
    const response = await fetch(endpoint, { method: 'GET' });
    if (!response.ok) {
      throw new Error(`Google ping failed with status ${response.status}`);
    }
    console.log(`Successfully pinged Google with sitemap: ${sitemapUrl}`);
  } catch (error) {
    console.error(`Unable to ping Google: ${error.message}`);
  }
};

const run = async () => {
  console.log('Generating XML sitemaps...');
  const result = await generateSitemaps();
  console.log('Sitemaps generated', result.counts);
  await pingGoogle(result.indexUrl);
};

run().catch((error) => {
  console.error('Postbuild tasks failed', error);
  process.exitCode = 1;
});
