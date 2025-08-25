const markdownIt = require('markdown-it');

module.exports = function(eleventyConfig) {
  // Copy static files
  eleventyConfig.addPassthroughCopy("static");
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/styles");
  eleventyConfig.addPassthroughCopy("src/scripts");

  // Markdown configuration
  const md = new markdownIt({
    html: true,
    breaks: true,
    linkify: true
  });
  eleventyConfig.setLibrary("md", md);

  // Collections
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/*.md")
      .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
  });

  eleventyConfig.addCollection("featuredPosts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/*.md")
      .filter(post => post.data.featured)
      .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
  });

  // Filters
  eleventyConfig.addFilter("dateFormat", function(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  });

  eleventyConfig.addFilter("dateISO", function(date) {
    return new Date(date).toISOString();
  });

  eleventyConfig.addFilter("limit", function(array, limit) {
    return array.slice(0, limit);
  });

  eleventyConfig.addFilter("categoryColor", function(categorySlug) {
    const colors = {
      'industry': '#3182CE',
      'research': '#38A169',
      'regulation': '#D69E2E',
      'technology': '#805AD5'
    };
    return colors[categorySlug] || '#718096';
  });

  // Shortcodes
  eleventyConfig.addShortcode("readingTime", function(content) {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    const readingTime = Math.ceil(words / wordsPerMinute);
    return readingTime;
  });

  // Global data
  eleventyConfig.addGlobalData("site", {
    title: "AI Current",
    description: "Get global AI insights in five minutes daily.",
    url: "https://aicurrent.netlify.app",
    author: "AI Current Inc."
  });

  // Load metadata files as global data
  eleventyConfig.addGlobalData("authors", require("./content/meta/authors.json"));
  eleventyConfig.addGlobalData("categories", require("./content/meta/categories.json"));
  eleventyConfig.addGlobalData("tagData", require("./content/meta/tags.json"));

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes"
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
