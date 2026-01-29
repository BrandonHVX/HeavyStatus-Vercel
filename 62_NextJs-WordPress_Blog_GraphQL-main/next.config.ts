import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
});

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https' as const,
        hostname: 'heavy-status.com',
      },
      {
        protocol: 'https' as const,
        hostname: '*.heavy-status.com',
      },
    ],
  },
  output: 'standalone' as const,
};

export default withPWA(nextConfig);
