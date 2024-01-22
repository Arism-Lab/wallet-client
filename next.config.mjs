/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: { serverActions: true },
	devIndicators: {
		buildActivity: false,
	},
};
export default nextConfig;
