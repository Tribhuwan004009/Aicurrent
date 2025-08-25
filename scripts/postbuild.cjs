const fs = require("fs");
const path = require("path");

// Make simple RSS + sitemap
const dist = "dist";
const siteUrl = "https://aicurrent.netlify.app";
const posts = fs.readdirSync("content").filter(f => f.endsWith(".md"));

let rssItems = "";
let sitemapItems = "";

posts.forEach(f => {
  const slug = f.replace(/\.md$/, "");
  const url = `${siteUrl}/${slug}/`;
  rssItems += `<item><title>${slug}</title><link>${url}</link></item>`;
  sitemapItems += `<url><loc>${url}</loc></url>`;
});

fs.writeFileSync(path.join(dist, "rss.xml"), `<?xml version="1.0"?><rss><channel>${rssItems}</channel></rss>`);
fs.writeFileSync(path.join(dist, "sitemap.xml"), `<?xml version="1.0"?><urlset>${sitemapItems}</urlset>`);
