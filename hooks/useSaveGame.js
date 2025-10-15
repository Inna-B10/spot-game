import { BASE_IMG_NAME } from '@/constants/constants'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export function useSaveGame(gameSlug, mode, imageFile, setModified, level) {
	const router = useRouter()

	const save = useCallback(async () => {
		//* ----------------------------- Mode === 'create' */
		if (mode === 'create') {
			//# ------------------------ basic validation
			if (!imageFile) {
				alert('Please upload an image file before saving.')
				return
			}
			if (!level.gameId) {
				alert('Internal error: missing gameId.')
				return
			}
			if (!Array.isArray(level.areas) || level.areas.length === 0) {
				alert('Please draw at least one area.')
				return
			}

			try {
				const formData = new FormData()
				formData.append('file', imageFile)
				formData.append('gameId', String(level.gameId)) //String() makes code explicit and safe
				formData.append('difficulty', level.difficulty || '')
				formData.append('name', BASE_IMG_NAME) // server will add random suffix
				formData.append('areas', JSON.stringify(level.areas))

				const res = await fetch(`/api/create-level?game=${encodeURIComponent(gameSlug)}`, {
					method: 'POST',
					body: formData,
				})
				const data = await res.json().catch(() => ({}))

				if (res.ok) {
					alert('✅ Level saved!')
					setModified(false)
					// server returns created levelSlug for redirect
					if (data.levelSlug) {
						router.replace(`/editor/${gameSlug}/${data.levelSlug}`)
					} else {
						router.replace(`/editor/${gameSlug}`)
					}
				} else {
					alert('❌ Error: ' + data.error || 'Unknown error')
					setModified(true)
				}
			} catch (e) {
				alert('❌ Error: ' + e.message)
			}
		} else {
			//* ----------------------------- Mode === 'edit' */
			//# ------------------------ basic validation
			if (!level.levelSlug) {
				alert('Missing levelSlug for update.')
				return
			}
			if (!level.imageUrl) {
				alert('Missing image URL for update.')
				return
			}
			if (!Array.isArray(level.areas) || level.areas.length === 0) {
				alert('Please draw at least one area before saving.')
				return
			}

			try {
				const payload = { levelSlug: level.levelSlug, imageUrl: level.imageUrl, areas: level.areas, difficulty: level.difficulty || null }

				const res = await fetch('/api/update-level', {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ game: gameSlug, payload }),
				})

				const data = await res.json().catch(() => ({}))

				if (res.ok) {
					alert('✅ Level updated!')
					setModified(false)
				} else {
					alert('❌ Error updating level: ' + (data.error || 'Unknown'))
					setModified(true)
				}
			} catch (e) {
				alert('❌ Failed to update: ' + e.message)
			}
		}
	}, [gameSlug, mode, imageFile, setModified, level?.gameId, level?.levelSlug, level?.imageUrl, level?.difficulty, level?.areas, router])
	return save
}
