import { BASE_IMG_NAME } from '@/config/config'
import { isDev } from '@/lib/utils/isDev'
import { apiCreateStage, apiUpdateStage } from '@/services/client/stagesClient.service'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { toast } from 'sonner'

export function useSaveStage(gameSlug, mode, imageFile, setModified, stage) {
	const router = useRouter()

	//* ---------------------------- Create Stage Mutation ---------------------------- */
	const createStageMutation = useMutation({
		mutationFn: ({ gameSlug, formData }) => apiCreateStage(gameSlug, formData),
		onSuccess: data => {
			toast.success('Stage saved!')

			router.refresh(`/${gameSlug}`)
			setModified(false)

			if (data?.stageSlug) {
				router.replace(`/editor/${gameSlug}/${data.stageSlug}`)
			} else {
				router.replace(`/editor/${gameSlug}`)
			}
		},
		onError: err => {
			toast.error('Error: ' + (err.message || 'Failed to create new stage.'))
			isDev && console.error('Create stage mutation error:', err)

			setModified(true)
		},
	})

	//* ---------------------------- Update Stage Mutation ---------------------------- */
	const updateStageMutation = useMutation({
		mutationFn: ({ gameSlug, updatedStage }) => apiUpdateStage(gameSlug, updatedStage),
		onSuccess: () => {
			toast.success('Stage updated!')

			router.refresh(`/${gameSlug}/${stage.stageSlug}`)

			setModified(false)
		},
		onError: err => {
			toast.error('Error: ' + (err.message || 'Failed to update stage.'))
			isDev && console.error('Update stage mutation error:', err)

			setModified(true)
		},
	})

	//* ---------------------------- Main Save Callback ---------------------------- */
	const saveStage = useCallback(async () => {
		//# ---------------------------- Create
		if (mode === 'create') {
			if (!imageFile) return toast.error('Please upload an image file before saving.')
			if (!stage.gameId) return toast.error('Internal error: missing gameId.')
			if (!stage.difficulty) return toast.error('Please select stage difficulty.')
			if (!Array.isArray(stage.areas) || stage.areas.length === 0) return toast.error('Please draw at least one area.')

			const formData = new FormData()
			formData.append('file', imageFile)
			formData.append('gameId', String(stage.gameId)) //String() makes code explicit and safe
			formData.append('task', stage.task?.trim() || '')
			formData.append('difficulty', stage.difficulty)
			formData.append('name', BASE_IMG_NAME) // server will add random suffix
			formData.append('areas', JSON.stringify(stage.areas))

			createStageMutation.mutate({ gameSlug, formData })
		} else {
			//# ---------------------------- Edit
			if (!stage.stageSlug) return toast.error('Internal error: Missing stageSlug for update.')
			if (!stage.imageUrl) return toast.error('Internal error: Missing image URL for update.')
			if (!stage.difficulty) return toast.error('Please select stage difficulty.')
			if (!Array.isArray(stage.areas) || stage.areas.length === 0) return toast.error('Please draw at least one area before saving.')

			const updatedStage = {
				stageSlug: stage.stageSlug.trim(),
				imageUrl: stage.imageUrl.trim(),
				task: stage.task?.trim() || '',
				difficulty: stage.difficulty,
				areas: stage.areas,
			}

			updateStageMutation.mutate({ gameSlug, updatedStage })
		}
	}, [mode, imageFile, stage.gameId, stage.areas, stage.difficulty, stage.stageSlug, stage.imageUrl, stage.task, createStageMutation, gameSlug, updateStageMutation])

	//# ---------------------------- Derived Loading State ----------------------------
	const isPending = useMemo(() => createStageMutation.isPending || updateStageMutation.isPending, [createStageMutation.isPending, updateStageMutation.isPending])

	//# Return both the function and state
	return { saveStage, isPending }
}
