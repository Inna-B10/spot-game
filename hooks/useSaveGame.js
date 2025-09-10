import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export function useSaveGame(
	saveGame,
	mode,
	id,
	imageUrl,
	imageFile,
	areas,
	setModified
) {
	const router = useRouter()
	/* ----------------------------- Mode === 'create' */
	const save = useCallback(async () => {
		if (mode === 'create') {
			if (!imageFile || areas.length === 0) {
				alert('Fill in all fields and upload the image')
				return
			}

			const formData = new FormData()
			formData.append('file', imageFile)
			formData.append('name', 'image')
			formData.append('areas', JSON.stringify(areas))
			try {
				const res = await fetch(`/api/create-level?game=${saveGame}`, {
					method: 'POST',
					body: formData,
				})
				const data = await res.json()

				if (res.ok) {
					alert('✅ Level saved! File: ' + data.file)
					setModified(false)
					router.replace(`/editor/${saveGame}/${data.id}`)
				} else {
					alert('❌ Error: ' + data.error)
					setModified(true)
				}
			} catch (e) {
				alert('❌ Error: ' + e.message)
			}
		} else {
			/* ----------------------------- Mode === 'edit' */
			if (!id || !imageUrl || areas.length === 0) {
				alert('❌ Missing fields')
				return
			}

			const updatedLevel = { id, image: imageUrl, areas }

			try {
				const res = await fetch('/api/update-level', {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ game: saveGame, id, updatedLevel }),
				})

				alert(res.ok ? '✅ Level updated!' : '❌ Error updating level')
				setModified(res.ok ? false : true)
			} catch (e) {
				alert('❌ Failed to update: ' + e.message)
			}
		}
	}, [saveGame, mode, id, imageUrl, imageFile, areas, setModified, router])
	return save
}
