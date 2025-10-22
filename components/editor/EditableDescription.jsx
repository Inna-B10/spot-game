import { Button } from '@/components/ui/buttons/Button'
import { sanitizeDesc } from '@/lib/utils/sanitizeInput'
import { apiUpdateGameDesc } from '@/services/client/gamesClient.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import cn from 'clsx'
import { useState } from 'react'

export default function EditableDescription({ initialDesc, gameSlug }) {
	const [desc, setDesc] = useState(initialDesc || '')
	const [lastSavedDesc, setLastSavedDesc] = useState(initialDesc || '')
	const [isEdited, setIsEdited] = useState(false)

	const queryClient = useQueryClient()

	/*//# --------------------- Mutation To Update Description --------------------- */
	const { mutate, isPending } = useMutation({
		mutationKey: ['update-game-desc'],
		mutationFn: newDesc => apiUpdateGameDesc(gameSlug, newDesc),
		onSuccess: () => {
			setLastSavedDesc(desc.trim())
			setIsEdited(false)
			queryClient.invalidateQueries(['gameSlug', gameSlug]) // refresh cached data
		},
	})

	/*//# -------------------------------- Handlers -------------------------------- */
	const handleSave = () => {
		if (desc.trim() === lastSavedDesc.trim()) {
			setDesc(desc.trim())
			setIsEdited(false)
			return
		}
		setDesc(desc.trim())
		mutate(desc.trim())
	}
	const handleCancel = () => {
		setIsEdited(false)
		setDesc(lastSavedDesc) // rollback to last saved
	}
	//* --------------------------------- Render --------------------------------- */
	return (
		<div className={cn('w-full flex gap-4 justify-between', isEdited ? 'items-end' : 'items-center')}>
			<div className='w-3/4'>
				<h2 className='font-semibold mr-2 w-full'>Description:</h2>
				{isEdited ? (
					<textarea value={sanitizeDesc(desc)} onChange={e => setDesc(e.target.value)} className='w-full' rows={2} />
				) : (
					lastSavedDesc || 'No description provided.'
				)}
			</div>

			{isEdited ? (
				<div className='flex gap-2 pb-2'>
					<Button disabled={isPending} onClick={handleSave}>
						Save
					</Button>
					<Button variant='secondary' onClick={handleCancel}>
						Cancel
					</Button>
				</div>
			) : (
				<Button onClick={() => setIsEdited(true)}>Edit desc</Button>
			)}
		</div>
	)
}
