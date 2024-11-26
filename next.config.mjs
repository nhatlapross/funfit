/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.externals.push({
          'utf-8-validate': 'commonjs utf-8-validate',
          'bufferutil': 'commonjs bufferutil',
        });
        return config;
      },
      // Ensure client-side only rendering
      async redirects() {
        return [
          {
            source: '/server-side-page',
            destination: '/',
            permanent: true,
          },
        ];
      },
};

export default nextConfig;
