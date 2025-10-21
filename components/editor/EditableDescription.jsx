import { Button } from '@/components/ui/buttons/Button'
import { isDev } from '@/lib/utils/isDev'
import { sanitizeDesc } from '@/lib/utils/sanitizeInput'
import { apiUpdateGameDesc } from '@/services/client/gamesClient.service'
import cn from 'clsx'
import { useState } from 'react'

export default function EditableDescription({ initialDesc, gameSlug }) {
	const [isEdited, setIsEdited] = useState(false)
	const [desc, setDesc] = useState(initialDesc || '')
	const [loading, setLoading] = useState(false)

	async function handleSave() {
		try {
			setLoading(true)
			const { success, data } = await apiUpdateGameDesc(gameSlug, desc)
			if (success) alert('Description updated successfully!')
			else alert('Failed to update')

			setIsEdited(false)
		} catch (err) {
			isDev && console.error('Update description error:', err)
			alert('Error updating description')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className={cn('w-full flex gap-4 justify-between', isEdited ? 'items-end' : 'items-center')}>
			<div className='w-3/4'>
				<h2 className='font-semibold mr-2 w-full'>Description:</h2>
				{isEdited ? (
					<textarea value={sanitizeDesc(desc)} onBlur={e => setDesc(e.target.value.trim())} onChange={e => setDesc(e.target.value)} className='w-full' rows={2} />
				) : (
					desc || 'No description provided.'
				)}
			</div>

			{isEdited ? (
				<div className='flex gap-2 pb-2'>
					<Button
						disabled={loading}
						onClick={() => {
							setDesc(desc.trim())
							handleSave()
						}}>
						Save
					</Button>
					<Button
						variant='secondary'
						onClick={() => {
							setIsEdited(false), setDesc(initialDesc)
						}}>
						Cancel
					</Button>
				</div>
			) : (
				<Button onClick={() => setIsEdited(true)}>Edit desc</Button>
			)}
		</div>
	)
}
