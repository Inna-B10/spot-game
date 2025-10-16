import { BASE_IMG_NAME } from '@/constants/constants'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export function useSaveGame(gameSlug, mode, imageFile, setModified, stage) {
	const router = useRouter()

	const save = useCallback(async () => {
		//* ----------------------------- Mode === 'create' */
		if (mode === 'create') {
			//# ------------------------ basic validation
			if (!imageFile) {
				alert('Please upload an image file before saving.')
				return
			}
			if (!stage.gameId) {
				alert('Internal error: missing gameId.')
				return
			}
			if (!Array.isArray(stage.areas) || stage.areas.length === 0) {
				alert('Please draw at least one area.')
				return
			}

			try {
				const formData = new FormData()
				formData.append('file', imageFile)
				formData.append('gameId', String(stage.gameId)) //String() makes code explicit and safe
				formData.append('difficulty', stage.difficulty || '')
				formData.append('name', BASE_IMG_NAME) // server will add random suffix
				formData.append('areas', JSON.stringify(stage.areas))

				const res = await fetch(`/api/create-stage?gameSlag=${encodeURIComponent(gameSlug)}`, {
					method: 'POST',
					body: formData,
				})
				const data = await res.json().catch(() => ({}))

				if (res.ok) {
					alert('✅ Stage saved!')
					setModified(false)
					// server returns created stageSlug for redirect
					if (data.stageSlug) {
						router.replace(`/editor/${gameSlug}/${data.stageSlug}`)
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
			if (!stage.stageSlug) {
				alert('Missing stageSlug for update.')
				return
			}
			if (!stage.imageUrl) {
				alert('Missing image URL for update.')
				return
			}
			if (!Array.isArray(stage.areas) || stage.areas.length === 0) {
				alert('Please draw at least one area before saving.')
				return
			}

			try {
				const payload = { stageSlug: stage.stageSlug, imageUrl: stage.imageUrl, areas: stage.areas, difficulty: stage.difficulty || null }

				const res = await fetch('/api/update-stage', {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ payload }),
				})

				const data = await res.json().catch(() => ({}))

				if (res.ok) {
					alert('✅ Stage updated!')
					setModified(false)
				} else {
					alert('❌ Error updating stage: ' + (data.error || 'Unknown'))
					setModified(true)
				}
			} catch (e) {
				alert('❌ Failed to update: ' + e.message)
			}
		}
	}, [gameSlug, mode, imageFile, setModified, stage?.gameId, stage?.stageSlug, stage?.imageUrl, stage?.difficulty, stage?.areas, router])
	return save
}
