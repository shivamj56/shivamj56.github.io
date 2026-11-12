/*
 * Writes the two finished pages from the client build and the SSR bundle:
 *   dist/index.html     Hindi, the canonical home of www.omshriharitrading.com
 *   dist/en/index.html  English
 * plus sitemap.xml and robots.txt. Every word is in the HTML itself, so search
 * engines and no-JS readers get the whole page; the script then hydrates it.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = process.env.OSHT_DIST || path.join(here, 'dist');
const ssr = process.env.OSHT_DIST_SSR || path.join(here, 'dist-ssr');
const { render, COPY, LINKS } = await import(pathToFileURL(path.join(ssr, 'entry-server.js')).href);

const SITE = 'https://www.omshriharitrading.com/';
const url = (lang) => (lang === 'en' ? SITE + 'en/' : SITE);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const OG = SITE + 'media/og/osht-1200x630.jpg';
const TODAY = '2026-11-12';

function jsonld(lang) {
  const t = COPY[lang];
  const org = SITE + '#organization';
  const graph = [
    {
      '@type': 'Organization', '@id': org, name: 'Om Shri Hari Trading Pvt Ltd',
      alternateName: ['OSHT', 'Om Shri Hari Trading', 'ओम श्री हरि ट्रेडिंग'], url: SITE,
      logo: SITE + 'media/brand/icon-512.png', telephone: '+91-99354-35500'
    },
    {
      '@type': 'WebSite', '@id': SITE + '#website', name: 'OSHT - Agro Trading',
      alternateName: ['OSHT', 'Om Shri Hari Trading'], url: SITE, inLanguage: ['hi', 'en'], publisher: { '@id': org }
    },
    {
      '@type': 'MobileApplication', '@id': SITE + '#app', name: 'OSHT - Agro Trading', alternateName: 'OSHT',
      description: t.seo.description, operatingSystem: 'Android, iOS', applicationCategory: 'BusinessApplication',
      inLanguage: ['hi', 'en'], url: SITE, image: OG, installUrl: LINKS.play, sameAs: [LINKS.ios, LINKS.play],
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' }, publisher: { '@id': org }
    },
    {
      '@type': 'FAQPage', '@id': url(lang) + '#faq', inLanguage: lang,
      mainEntity: t.faq.items.map((q) => ({ '@type': 'Question', name: q.q, acceptedAnswer: { '@type': 'Answer', text: q.a } }))
    }
  ];
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
}

function head(lang) {
  const t = COPY[lang];
  return [
    `<title>${esc(t.seo.title)}</title>`,
    `<meta name="description" content="${esc(t.seo.description)}">`,
    `<link rel="canonical" href="${url(lang)}">`,
    `<link rel="alternate" hreflang="hi" href="${url('hi')}">`,
    `<link rel="alternate" hreflang="en" href="${url('en')}">`,
    `<link rel="alternate" hreflang="x-default" href="${url('hi')}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="OSHT - Agro Trading">`,
    `<meta property="og:locale" content="${lang === 'en' ? 'en_IN' : 'hi_IN'}">`,
    `<meta property="og:url" content="${url(lang)}">`,
    `<meta property="og:title" content="${esc(t.seo.title)}">`,
    `<meta property="og:description" content="${esc(t.seo.description)}">`,
    `<meta property="og:image" content="${OG}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:image" content="${OG}">`,
    `<script type="application/ld+json">${jsonld(lang)}</script>`
  ].join('\n');
}

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
for (const lang of ['hi', 'en']) {
  let html = template
    .replace('%LANG%', lang)
    .replace('<!--seo-->', head(lang))
    .replace('<!--app-html-->', render(lang));
  let out = path.join(dist, 'index.html');
  if (lang === 'en') {
    // English sits one folder down; the build's relative links need one more step up.
    html = html.replace(/(src|href)="\.\/(assets|favicon|apple-touch)/g, '$1="../$2');
    fs.mkdirSync(path.join(dist, 'en'), { recursive: true });
    out = path.join(dist, 'en', 'index.html');
  }
  fs.writeFileSync(out, html);
  console.log('wrote', path.relative(here, out), (html.length / 1024).toFixed(0) + ' KB');
}

fs.writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${['hi', 'en']
  .map(
    (l) => `  <url>
    <loc>${url(l)}</loc>
    <lastmod>${TODAY}</lastmod>
    <xhtml:link rel="alternate" hreflang="hi" href="${url('hi')}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${url('en')}"/>
  </url>`
  )
  .join('\n')}
</urlset>
`
);
fs.writeFileSync(
  path.join(dist, 'robots.txt'),
  `# OSHT - Agro Trading — Om Shri Hari Trading Pvt Ltd. Everything here is public.\nUser-agent: *\nAllow: /\n\nSitemap: ${SITE}sitemap.xml\n`
);
console.log('wrote sitemap.xml, robots.txt');
