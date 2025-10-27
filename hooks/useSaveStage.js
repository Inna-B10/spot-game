import { BASE_IMG_NAME } from '@/config/config'
import { isDev } from '@/lib/utils/isDev'
import { apiCreateStage, apiUpdateStage } from '@/services/client/stagesClient.service'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'

export function useSaveStage(gameSlug, mode, imageFile, setModified, stage) {
	const router = useRouter()

	//* ---------------------------- Create Stage Mutation ---------------------------- */
	const createStageMutation = useMutation({
		mutationFn: ({ gameSlug, formData }) => apiCreateStage(gameSlug, formData),
		onSuccess: data => {
			if (data?.success) {
				alert('✅ Stage saved!')
				setModified(false)
				if (data?.data?.stageSlug) {
					router.replace(`/editor/${gameSlug}/${data.data.stageSlug}`)
				} else {
					router.replace(`/editor/${gameSlug}`)
				}
			} else {
				alert('❌ Error: ' + (data?.error || 'Failed to create new stage'))
				setModified(true)
			}
		},
		onError: err => {
			isDev && console.error('Create stage mutation error:', err)
			alert('❌ Error creating stage: ' + (err.message || 'Unknown'))
			setModified(true)
		},
	})

	//* ---------------------------- Update Stage Mutation ---------------------------- */
	const updateStageMutation = useMutation({
		mutationFn: ({ gameSlug, payload }) => apiUpdateStage(gameSlug, payload),
		onSuccess: data => {
			if (data?.success) {
				alert('✅ Stage updated!')
				setModified(false)
			} else {
				alert('❌ Update stage error: ' + (data?.error || 'Unknown'))
				setModified(true)
			}
		},
		onError: err => {
			isDev && console.error('Update stage mutation error:', err)
			alert('❌ Error updating stage: ' + (err.message || 'Unknown'))
			setModified(true)
		},
	})

	//* ---------------------------- Main Save Callback ---------------------------- */
	const saveStage = useCallback(async () => {
		//# ---------------------------- Create
		if (mode === 'create') {
			if (!imageFile) return alert('Please upload an image file before saving.')
			if (!stage.gameId) return alert('Internal error: missing gameId.')
			if (!stage.difficulty) return alert('Please select stage difficulty.')
			if (!Array.isArray(stage.areas) || stage.areas.length === 0) return alert('Please draw at least one area.')

			const formData = new FormData()
			formData.append('file', imageFile)
			formData.append('gameId', String(stage.gameId)) //String() makes code explicit and safe
			formData.append('task', stage.task || '')
			formData.append('difficulty', stage.difficulty || '')
			formData.append('name', BASE_IMG_NAME) // server will add random suffix
			formData.append('areas', JSON.stringify(stage.areas))

			createStageMutation.mutate({ gameSlug, formData })
		} else {
			//# ---------------------------- Edit
			if (!stage.stageSlug) return alert('Internal error: Missing stageSlug for update.')
			if (!stage.imageUrl) return alert('Internal error: Missing image URL for update.')
			if (!stage.difficulty) return alert('Please select stage difficulty.')
			if (!Array.isArray(stage.areas) || stage.areas.length === 0) return alert('Please draw at least one area before saving.')

			const payload = {
				stageSlug: stage.stageSlug.trim(),
				imageUrl: stage.imageUrl.trim(),
				task: stage.task.trim(),
				difficulty: stage.difficulty?.trim() || null,
				areas: stage.areas,
			}

			updateStageMutation.mutate({ gameSlug, payload })
		}
	}, [mode, imageFile, stage.gameId, stage.areas, stage.difficulty, stage.stageSlug, stage.imageUrl, stage.task, createStageMutation, gameSlug, updateStageMutation])

	//# ---------------------------- Derived Loading State ----------------------------
	const isPending = useMemo(() => createStageMutation.isPending || updateStageMutation.isPending, [createStageMutation.isPending, updateStageMutation.isPending])

	//# Return both the function and state
	return { saveStage, isPending }
}
