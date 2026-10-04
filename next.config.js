/** @type {import('next').NextConfig} */

const repoName = process.env.REPO_NAME || "";
const isProd = !!repoName;
const basePath = isProd ? `/${repoName}` : "";

const nextConfig = {
  output: "export",
  basePath,
  // assetPrefix must equal basePath (no trailing slash) for static hosts
  assetPrefix: basePath,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Expose basePath to client components via env
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

module.exports = nextConfig;
