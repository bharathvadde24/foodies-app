// //next.config.js


// /** @type {import('next').NextConfig} */
// const nextConfig = {}

// module.exports = nextConfig


// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb', // Increase from default 1MB
        },
    },
}

module.exports = nextConfig