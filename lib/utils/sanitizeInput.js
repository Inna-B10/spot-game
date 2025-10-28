export function sanitizeName(name) {
	// remove unsafe symbols (keep letters, numbers, spaces, hyphens)
	const sanitizedName = name
		?.replace(/[^a-zA-Z0-9\s-]/g, '') //[TODO] multilanguage? .replace(/[^\p{L}\p{N}\s-]/gu, '')
		.replace(/^-|-$/g, '')
		.replace(/(\s)+/g, ' ')

	// capitalize first letter
	return sanitizedName ? sanitizedName.charAt(0).toUpperCase() + sanitizedName.slice(1) : ''
}

export function sanitizeDesc(desc) {
	const sanitizedDesc = desc
		// allow letters, numbers, spaces, hyphens, dots, commas
		?.replace(/[^a-zA-Z0-9\s\-.,]/g, '')
		.replace(/^-|-$/g, '')
		.replace(/(\s)+/g, ' ')
		.replace(/([.,-])\1+/g, '$1')
		.replace(/([.,])([^\s])/g, '$1 $2')

	// capitalize first letter
	return sanitizedDesc ? sanitizedDesc.charAt(0).toUpperCase() + sanitizedDesc.slice(1) : ''
}

export function createSlug(text) {
	return text
		?.toLowerCase()
		.replace(/(\s)+/g, ' ')
		.replace(/\s+/g, '-') // replace spaces with dashes
		.replace(/-+/g, '-') // collapse multiple dashes
		.replace(/^-|-$/g, '') // remove leading/trailing dashes
		.trim()
}
