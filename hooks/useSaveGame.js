import { BASE_IMG_NAME } from '@/config/config'
import { apiCreateStage, apiUpdateStage } from '@/services/client/stagesClient.service'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export function useSaveGame(gameSlug, mode, imageFile, setModified, stage) {
	const router = useRouter()

	const save = useCallback(async () => {
		//* ----------------------------- Mode === 'create' */
		if (mode === 'create') {
			//# ------------------------ basic validation
			if (!imageFile) return alert('Please upload an image file before saving.')
			if (!stage.gameId) return alert('Internal error: missing gameId.')
			if (!Array.isArray(stage.areas) || stage.areas.length === 0) return alert('Please draw at least one area.')

			const formData = new FormData()
			formData.append('file', imageFile)
			formData.append('gameId', String(stage.gameId)) //String() makes code explicit and safe
			formData.append('difficulty', stage.difficulty || '')
			formData.append('name', BASE_IMG_NAME) // server will add random suffix
			formData.append('areas', JSON.stringify(stage.areas))

			const { success, data, error } = await apiCreateStage(gameSlug, formData)

			if (success) {
				alert('✅ Stage saved!')
				setModified(false)
				// server returns created stageSlug for redirect
				if (data.stageSlug) {
					router.replace(`/editor/${gameSlug}/${data.stageSlug}`)
				} else {
					router.replace(`/editor/${gameSlug}`)
				}
			} else {
				alert('❌ Error: ' + (error || data?.error || 'Unknown'))
				setModified(true)
			}
		} else {
			//* ----------------------------- Mode === 'edit' */
			//# ------------------------ basic validation
			if (!stage.stageSlug) return alert('Missing stageSlug for update.')
			if (!stage.imageUrl) return alert('Missing image URL for update.')
			if (!Array.isArray(stage.areas) || stage.areas.length === 0) return alert('Please draw at least one area before saving.')

			const payload = { stageSlug: stage.stageSlug, imageUrl: stage.imageUrl, areas: stage.areas, difficulty: stage.difficulty || null }

			const { success, error } = await apiUpdateStage(gameSlug, payload)

			if (success) {
				alert('✅ Stage updated!')
				setModified(false)
			} else {
				alert('❌ Update stage error: ' + (error || 'Unknown'))
				setModified(true)
			}
		}
	}, [gameSlug, mode, imageFile, setModified, stage?.gameId, stage?.stageSlug, stage?.imageUrl, stage?.difficulty, stage?.areas, router])
	return save
}
