export async function useSaveGame(
	saveGame,
	mode,
	id,
	imageUrl,
	points,
	setModified,
	game
) {
	if (mode === 'create') {
		if (!imageFile || points.length === 0) {
			alert('Fill in all fields and upload the image')
			return
		}

		const formData = new FormData()
		formData.append('file', imageFile)
		formData.append('name', 'image')
		formData.append('points', JSON.stringify(points))
		try {
			const res = await fetch(`/api/create-level?game=${saveGame}`, {
				method: 'POST',
				body: formData,
			})
			const data = await res.json()
			alert(
				res.ok
					? `✅ Level saved! File: ${data.file}`
					: `❌ Error: ${data.error}`
			)
			setModified(res.ok ? false : true)
		} catch (e) {
			alert('❌ Error: ' + e.message)
		}
	} else {
		/* ----------------------------- Mode === 'edit' */
		if (!id || !imageUrl || points.length === 0) {
			alert('❌ Missing fields')
			return
		}

		const updatedLevel = { id, image: imageUrl, points }

		try {
			const res = await fetch('/api/update-level', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ game, id, updatedLevel }),
			})

			alert(res.ok ? '✅ Level updated!' : '❌ Failed')
			setModified(res.ok ? false : true)
		} catch (e) {
			alert('❌ Failed to update: ' + e.message)
		}
	}
}
