/** @type {import('next').NextConfig} */

// When building for GitHub Pages, REPO_NAME is injected by the workflow.
// Locally it's empty → no basePath needed.
const repoName = process.env.REPO_NAME || "";
const isProd = !!repoName;

const nextConfig = {
  // Static HTML export — required for GitHub Pages (no Node.js server)
  output: "export",

  // basePath  = /ai-bloggers   (only in production)
  basePath: isProd ? `/${repoName}` : "",

  // assetPrefix must include trailing slash for CSS/JS assets
  assetPrefix: isProd ? `/${repoName}/` : "",

  // next/image optimization is unavailable on static hosts
  images: {
    unoptimized: true,
  },

  // Trailing slashes make static routing predictable on GitHub Pages
  trailingSlash: true,
};

module.exports = nextConfig;
