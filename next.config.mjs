import path from 'path'

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

// Fix for Windows "EPERM: operation not permitted, scandir 'C:\\Users\\...\\Application Data'"
// Forces all tools to stay within the project directory

if (process.platform === 'win32') {
	process.env.HOME = path.resolve('./')
	process.env.USERPROFILE = path.resolve('./')
	console.log('⚙️ HOME and USERPROFILE overridden to', process.env.HOME)
}

export default nextConfig
