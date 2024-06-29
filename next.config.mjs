/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    TMDB_API_KEY: process.env.TMDB_API_KEY,
  },
};

export default nextConfig;
