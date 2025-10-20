//* ---------------------------- Create New Stage ---------------------------- */
export async function createStageClient(gameSlug, formData) {
	try {
		const res = await fetch(`/api/stage/create?gameSlug=${encodeURIComponent(gameSlug)}`, {
			method: 'POST',
			body: formData,
		})
		const data = await res.json()
		return { success: res.ok, data }
	} catch (err) {
		console.error('Client create stage error:', err)
		return { success: false, error: err.message }
	}
}

//* ---------------------------- Update Existing Stage ---------------------------- */
export async function updateStageClient(payload) {
	try {
		const res = await fetch('/api/stage/update', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ payload }),
		})
		return { success: res.ok }
	} catch (err) {
		console.error('Client update stage error:', err)
		return { success: false, error: err.message }
	}
}
