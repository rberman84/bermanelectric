import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import siteConfig from '../src/lib/site-config.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const SITE_URL = siteConfig.siteUrl;

const ensureLeadingSlash = (value) => (value.startsWith('/') ? value : `/${value}`);

const toAbsolute = (pathname) => new URL(ensureLeadingSlash(pathname), SITE_URL).toString();

const formatDate = (value) => new Date(value).toISOString();

const buildUrlEntry = ({ loc, lastmod, changefreq, priority }) => `    <url>\n      <loc>${loc}</loc>\n      <lastmod>${lastmod}</lastmod>\n      <changefreq>${changefreq}</changefreq>\n      <priority>${priority.toFixed(2)}</priority>\n    </url>`;

const writeSitemap = async (filename, urls) => {
  const content = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(buildUrlEntry),
    '</urlset>',
    ''
  ].join('\n');

  await fs.writeFile(path.join(publicDir, filename), content, 'utf8');
};

const extractBlogPosts = async () => {
  const blogPostPath = path.join(rootDir, 'src/pages/BlogPost.tsx');
  const contents = await fs.readFile(blogPostPath, 'utf8');
  const matches = [...contents.matchAll(/"([^"]+)":\s*\{[\s\S]*?date:\s*"([0-9-]+)"/g)];
  const unique = new Map();

  for (const [, slug, date] of matches) {
    const loc = toAbsolute(`/blog/${slug}`);
    const lastmod = formatDate(date);
    unique.set(slug, {
      loc,
      lastmod,
      changefreq: 'monthly',
      priority: 0.70,
    });
  }

  return Array.from(unique.values());
};

export const generateSitemaps = async () => {
  const buildTimestamp = new Date().toISOString();

  const staticPages = siteConfig.pages.map((page) => ({
    loc: toAbsolute(page.path),
    lastmod: buildTimestamp,
    changefreq: page.changefreq || 'monthly',
    priority: page.priority ?? 0.6,
  }));

  const locationPages = siteConfig.locations.map((location) => ({
    loc: toAbsolute(location.path),
    lastmod: buildTimestamp,
    changefreq: location.changefreq || 'weekly',
    priority: location.priority ?? 0.8,
  }));

  const blogPosts = await extractBlogPosts();

  await writeSitemap('sitemap-pages.xml', staticPages);
  await writeSitemap('sitemap-locations.xml', locationPages);
  await writeSitemap('sitemap-posts.xml', blogPosts);

  const sitemapIndex = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `  <sitemap>\n    <loc>${toAbsolute('/sitemap-pages.xml')}</loc>\n    <lastmod>${buildTimestamp}</lastmod>\n  </sitemap>`,
    `  <sitemap>\n    <loc>${toAbsolute('/sitemap-locations.xml')}</loc>\n    <lastmod>${buildTimestamp}</lastmod>\n  </sitemap>`,
    `  <sitemap>\n    <loc>${toAbsolute('/sitemap-posts.xml')}</loc>\n    <lastmod>${buildTimestamp}</lastmod>\n  </sitemap>`,
    '</sitemapindex>',
    ''
  ].join('\n');

  await fs.writeFile(path.join(publicDir, 'sitemap.xml'), sitemapIndex, 'utf8');

  return {
    indexUrl: toAbsolute('/sitemap.xml'),
    counts: {
      pages: staticPages.length,
      locations: locationPages.length,
      posts: blogPosts.length,
    },
  };
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateSitemaps()
    .then((result) => {
      console.log(`Generated sitemaps:`, result);
    })
    .catch((error) => {
      console.error('Failed to generate sitemaps', error);
      process.exitCode = 1;
    });
}
