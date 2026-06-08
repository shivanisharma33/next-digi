const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE_URL = 'https://www.digipowerx.com';

// Static routes list
const staticRoutes = [
  '/',
  '/about',
  '/contact',
  '/services',
  '/energy',
  '/data-centers',
  '/neocloudz',
  '/careers',
  '/sec-filings',
  '/leadership',
  '/press-releases',
  '/investors',
  '/documents-charters',
  '/privacy-policy',
  '/terms-of-use',
  '/email-alerts',
  '/mission-vision',
  '/global-network',
  '/partnership'
];

// Helper to fetch JSON using Node's native https module
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error(`Status Code: ${res.statusCode}`));
      }
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Slugification helpers (identical to frontend logic)
function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

function generateSlug(title, documentId) {
  const safeTitle = slugify(title) || 'document';
  return `${safeTitle}-${documentId}`;
}

function getFilingTitle(type, dateStr) {
  if (!dateStr) return `${type} Filing`;
  try {
    const date = new Date(dateStr + "T00:00:00");
    const year = date.getFullYear();
    const month = date.getMonth();
    
    if (isNaN(year) || isNaN(month)) {
      return `${type} Filing`;
    }
    
    if (type === "10-Q") {
      let q = "Q3";
      let qYear = year;
      if (month >= 0 && month < 3) {
        q = "Q4";
        qYear = year - 1;
      } else if (month >= 3 && month < 6) {
        q = "Q1";
      } else if (month >= 6 && month < 9) {
        q = "Q2";
      } else {
        q = "Q3";
      }
      return `Quarterly Report — ${q} ${qYear}`;
    } else if (type === "10-K" || type === "20-F") {
      return `Annual Report — Fiscal Year ${year - 1}`;
    } else if (type === "8-K" || type === "6-K" || type === "6-K/A") {
      return `Current Report — ${date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    }
    return `${type} Report — ${date.toLocaleDateString("en-US", { month: "short", year: "numeric" })}`;
  } catch (e) {
    return `${type} Filing`;
  }
}

async function run() {
  console.log('Generating sitemap.xml & robots.txt...');
  const urls = [...staticRoutes];

  // 1. Fetch dynamic press releases
  try {
    console.log('Fetching press releases...');
    const pressRes = await fetchJson(
      'https://thankful-miracle-1ed8bdfdaf.strapiapp.com/api/press-releases?pagination[limit]=1000&fields=title,documentId'
    );
    if (pressRes && Array.isArray(pressRes.data)) {
      pressRes.data.forEach((item) => {
        if (item.title && item.documentId) {
          const slug = generateSlug(item.title, item.documentId);
          urls.push(`/press-releases/${slug}`);
        }
      });
      console.log(`Added ${pressRes.data.length} dynamic press release URLs.`);
    }
  } catch (err) {
    console.error('Warning: Failed to fetch press releases for sitemap:', err.message);
  }

  // 2. Fetch dynamic SEC filings
  try {
    console.log('Fetching SEC filings...');
    const secRes = await fetchJson(
      'https://thankful-miracle-1ed8bdfdaf.strapiapp.com/api/sec-filings?pagination[limit]=1000&fields=form_type,date,documentId'
    );
    if (secRes && Array.isArray(secRes.data)) {
      secRes.data.forEach((item) => {
        if (item.documentId) {
          const docType = String(item.form_type || item.type || '10-Q');
          let displayType = docType;
          if (docType.includes("10-Q")) {
            displayType = "10-Q";
          } else if (docType.includes("10-K")) {
            displayType = "10-K";
          } else if (docType.includes("20-F")) {
            displayType = "20-F";
          } else if (docType.includes("8-K") || docType.includes("6-K")) {
            displayType = "8-K";
          } else if (docType.toLowerCase().includes("13g") || docType.toLowerCase().includes("schedule")) {
            displayType = "S-13G";
          }
          const displayTitle = getFilingTitle(displayType, item.date);
          const slug = generateSlug(displayTitle, item.documentId);
          urls.push(`/sec-filings/${slug}`);
        }
      });
      console.log(`Added ${secRes.data.length} dynamic SEC filing URLs.`);
    }
  } catch (err) {
    console.error('Warning: Failed to fetch SEC filings for sitemap:', err.message);
  }

  // 3. Construct sitemap XML content
  const today = new Date().toISOString().split('T')[0];
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  urls.forEach((route) => {
    // Escape XML characters in URLs
    const safeUrl = `${BASE_URL}${route}`
      .replace(/&/g, '&amp;')
      .replace(/'/g, '&apos;')
      .replace(/"/g, '&quot;')
      .replace(/>/g, '&gt;')
      .replace(/</g, '&lt;');

    // Home page gets higher priority
    const priority = route === '/' ? '1.0' : '0.8';
    
    xml += '  <url>\n';
    xml += `    <loc>${safeUrl}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += '    <changefreq>daily</changefreq>\n';
    xml += `    <priority>${priority}</priority>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>\n';

  // 4. Ensure target directory exists and write sitemap.xml
  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
  console.log(`Sitemap written successfully to ${path.join(publicDir, 'sitemap.xml')}`);

  // 5. Write robots.txt pointing to the sitemap
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
  console.log(`robots.txt written successfully to ${path.join(publicDir, 'robots.txt')}`);
}

run();
