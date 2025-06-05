/** @type {import('next').NextConfig} */
const nextConfig = {
  // Markdownファイルを処理するための設定
  experimental: {
    turbo: {
      rules: {
        // Configures Turbopack to handle markdown files
        '*.md': {
          loaders: ['raw'],
        },
      },
    },
  },
};

module.exports = nextConfig; 