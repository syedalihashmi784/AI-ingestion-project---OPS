/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment variables exposed to the browser
  // IMPORTANT: Only put non-secret values here
  // Secret keys go in .env and are never exposed to the browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
}

module.exports = nextConfig
