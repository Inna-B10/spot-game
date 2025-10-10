//* ---------------------------- Is Point In Area ---------------------------- */
// check if a point (x, y) is inside a given area (circle or rectangle)

export function isPointInArea(x, y, area) {
	if (area.type === 'circle') {
		const dx = x - area.x
		const dy = y - area.y
		return Math.sqrt(dx * dx + dy * dy) < area.radius
	}
	if (area.type === 'rect') {
		return x >= area.x && x <= area.x + area.width && y >= area.y && y <= area.y + area.height
	}
	return false
}

//* ----------------------------- Utility: get mouse coords ----------------------------- */
export function getRelativeCoordsPx(e, imageRef) {
	const rect = imageRef.current.getBoundingClientRect()
	const x = e.clientX - rect.left
	const y = e.clientY - rect.top
	return { x, y }
}
