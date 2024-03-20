/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
        {
            hostname: "avatars.githubusercontent.com",
            protocol: "https",
        },
        {
            hostname: "images.unsplash.com",
            protocol: "https",
        },
        {
            hostname: "unsplash.com",
            protocol: "https",
        },
        {
            hostname: "source.unsplash.com",
            protocol: "https",
        },
        {
            hostname: "as2.ftcdn.net",
            protocol: "https",
        }
        ],
    },
};

module.exports = nextConfig;
