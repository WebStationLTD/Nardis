/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nardis.rosset.website",
      },
    ],
  },
};

export default nextConfig;
