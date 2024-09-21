module.exports = {
  reactStrictMode: true,
  images: {
    unoptimized: true,  // Disables image optimization for static exports
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
    ],
  },
  output: 'export',  // Enables static site export
};
