const fs = require('fs');
const path = require('path');

// Post-build script to generate RSS and sitemap
async function postBuild() {
  try {
    console.log('Running post-build tasks...');
    
    // Generate RSS feed
    await generateRSS();
    
    // Generate sitemap
    await generateSitemap();
    
    console.log('Post-build tasks completed successfully!');
  } catch (error) {
    console.error('Error during post-build:', error);
    process.exit(1);
  }
}

async function generateRSS() {
  const siteConfig = {
    title: 'AI Current',
    description: 'Get global AI insights in five minutes daily.',
    url: 'https://aicurrent.netlify.app',
    language: 'en'
  };
  
  // Read posts from content directory
  const contentDir = path.join(process.cwd(), 'content');
  const posts = [];
  
  if (fs.existsSync(contentDir)) {
    const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.md'));
    
    files.forEach(file => {
      const content = fs.readFileSync(path.join(contentDir, file), 'utf-8');
      const frontMatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
      
      if (frontMatterMatch) {
        const frontMatter = frontMatterMatch[1];
        const lines = frontMatter.split('\n');
        const post = {};
        
        lines.forEach(line => {
          const [key, ...valueParts] = line.split(':');
          if (key && valueParts.length) {
            const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
            post[key.trim()] = value;
          }
        });
        
        if (post.title && post.date) {
          posts.push({
            title: post.title,
            description: post.summary || '',
            url: `${siteConfig.url}/${post.slug || file.replace('.md', '')}`,
            date: new Date(post.date).toISOString(),
            content: content.split('---')[2] || ''
          });
        }
      }
    });
  }
  
  // Sort posts by date (newest first)
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Generate RSS XML
  const rssXML = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.title}</title>
    <description>${siteConfig.description}</description>
    <link>${siteConfig.url}</link>
    <language>${siteConfig.language}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}/rss.xml" rel="self" type="application/rss+xml"/>
    ${posts.slice(0, 20).map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description}]]></description>
      <link>${post.url}</link>
      <guid isPermaLink="true">${post.url}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`).join('')}
  </channel>
</rss>`;
  
  // Write RSS file
  const distDir = path.join(process.cwd(), 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(distDir, 'rss.xml'), rssXML);
  console.log('✓ RSS feed generated');
}

async function generateSitemap() {
  const siteConfig = {
    url: 'https://aicurrent.netlify.app'
  };
  
  const urls = [
    { loc: siteConfig.url, priority: '1.0', changefreq: 'daily' },
    { loc: `${siteConfig.url}/about`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${siteConfig.url}/resources`, priority: '0.8', changefreq: 'weekly' }
  ];
  
  // Add posts to sitemap
  const contentDir = path.join(process.cwd(), 'content');
  
  if (fs.existsSync(contentDir)) {
    const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.md'));
    
    files.forEach(file => {
      const content = fs.readFileSync(path.join(contentDir, file), 'utf-8');
      const frontMatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
      
      if (frontMatterMatch) {
        const frontMatter = frontMatterMatch[1];
        const lines = frontMatter.split('\n');
        const post = {};
        
        lines.forEach(line => {
          const [key, ...valueParts] = line.split(':');
          if (key && valueParts.length) {
            const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
            post[key.trim()] = value;
          }
        });
        
        if (post.slug) {
          urls.push({
            loc: `${siteConfig.url}/${post.slug}`,
            lastmod: new Date(post.date || Date.now()).toISOString().split('T')[0],
            priority: '0.6',
            changefreq: 'monthly'
          });
        }
      }
    });
  }
  
  // Generate sitemap XML
  const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  
  // Write sitemap file
  const distDir = path.join(process.cwd(), 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXML);
  console.log('✓ Sitemap generated');
}

// Run post-build tasks
postBuild();
