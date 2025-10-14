/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'thusoqjtw5ut1wos.public.blob.vercel-storage.com',
				pathname: '/**',
			},
		],
	},
}

export default nextConfig
