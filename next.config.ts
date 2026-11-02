import type { NextConfig } from "next";

// GitHub Pages build (.github/workflows/deploy-pages.yml): static export served under
// /<repo-name>, passed in as NEXT_PUBLIC_BASE_PATH. Local `npm run dev` / `npm run build` are unaffected.
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = isGithubPages
  ? {
      output: "export",
      basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
