export const BLOB_URL = process.env.NEXT_PUBLIC_BLOB_BASE_URL
export const BASE_IMG_NAME = 'image'

// Use 86400(1day) for development to test ISR/build-time snapshot
// Use false in production to avoid build errors and use runtime fetch with tags
export const REVALIDATE_INTERVAL = process.env.NODE_ENV ? 86400 : false
