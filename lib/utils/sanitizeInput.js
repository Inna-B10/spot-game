export function sanitizeName(name) {
	// remove unsafe symbols (keep letters, numbers, spaces, hyphens)
	const sanitizedName = name
		?.replace(/[^a-zA-Z0-9\s-]/g, '') //[TODO] multilanguage? .replace(/[^\p{L}\p{N}\s-]/gu, '')
		.replace(/^-|-$/g, '')

	if (!sanitizedName) {
		alert('Game name: invalid format!')
		return ''
	}

	// capitalize first letter
	return sanitizedName.charAt(0).toUpperCase() + sanitizedName.slice(1)
}

export function sanitizeDesc(desc) {
	const sanitizedDesc = desc
		// allow letters, numbers, spaces, hyphens, dots, commas
		?.replace(/[^a-zA-Z0-9\s\-.,]/g, '')
		.replace(/^-|-$/g, '')
		.replace(/-+/g, '-')

	// capitalize first letter
	return sanitizedDesc ? sanitizedDesc.charAt(0).toUpperCase() + sanitizedDesc.slice(1) : ''
}

export function createSlug(text) {
	return text
		?.toLowerCase()
		.replace(/\s+/g, '-') // replace spaces with dashes
		.replace(/-+/g, '-') // collapse multiple dashes
		.replace(/^-|-$/g, '') // remove leading/trailing dashes
		.trim()
}
