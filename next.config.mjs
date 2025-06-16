/** @type {import('next').NextConfig} */
const nextConfig = {
  // Bật lại React Strict Mode để catch hooks issues
  reactStrictMode: true,
  
  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 0,
    },
    instrumentationHook: true,
    missingSuspenseWithCSRBailout: false,
    serverActions: {
      bodySizeLimit: "5GB",
    },
  },
  
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**",
      },
      {
        protocol: "https", 
        hostname: "**",
      },
    ],
    unoptimized: true,
  },
  
  sassOptions: {
    silenceDeprecations: ["legacy-js-api"],
  },
};

export default nextConfig;