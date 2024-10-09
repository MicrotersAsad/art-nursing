/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',  // For Azure deployment
  reactStrictMode: true,

  images: {
    unoptimized: false,  // Enable Next.js image optimization
    deviceSizes: [640, 768, 1024, 1280, 1600],  // Define responsive image sizes
    imageSizes: [16, 32, 48, 64, 96],  // Additional smaller sizes for thumbnails/icons

    // Add the required domains to allow loading remote images
    domains: ['artncedubd.com'],  // Domain added for image hosting

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'artncedubd.com',  // Your domain for images
        port: '',  // Leave empty unless a specific port is used
        pathname: '/uploads/**',  // Path for the image directory
      },
    ],
  },

  compress: true,
  swcMinify: true,

  webpack(config) {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg)$/i,
      use: [
        {
          loader: 'image-webpack-loader',
          options: {
            mozjpeg: {
              progressive: true,
              quality: 75,
            },
            optipng: {
              enabled: true,
            },
            pngquant: {
              quality: [0.7, 0.9],
              speed: 3,
            },
            gifsicle: {
              interlaced: false,
            },
          },
        },
      ],
    });

    return config;
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',  // Cache static assets for 1 year
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
