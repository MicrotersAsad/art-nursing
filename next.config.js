/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',  // For Azure deployment
  reactStrictMode: true,
  images: {
    unoptimized: true,  // Disables image optimization if you're using Azure's CDN or Blob Storage for static images
    remotePatterns: [
      {
        protocol: 'https',  // Update to 'https' for production, assuming your app uses SSL
        hostname: 'https://artnursing.azurewebsites.net/',  // Replace with your production hostname or CDN
        port: '',  // Leave empty unless you're specifying a port in production
        pathname: '/uploads/**',  // Ensure this matches your production URL structure for image storage
      },
    ],
  },
};

module.exports = nextConfig;
