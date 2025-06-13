/** @type {import('next').NextConfig} */
const nextConfig = {
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
        silenceDeprecations: ['legacy-js-api'],
    },
    experimental: {
        instrumentationHook: true, // Enable instrumentation
        missingSuspenseWithCSRBailout: false,
        serverActions: {
            bodySizeLimit: '5GB',
        },
    },
};

export default nextConfig;
