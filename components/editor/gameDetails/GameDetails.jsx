import { Button } from '@/components/ui/buttons/Button'
import { isDev } from '@/lib/utils/isDev'
import { sanitizeDesc, sanitizeName } from '@/lib/utils/sanitizeInput'
import { apiUpdateGame } from '@/services/client/gamesClient.service'
import { useMutation } from '@tanstack/react-query'
import cn from 'clsx'
import { Edit } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

//* ---------------------------------- Page ---------------------------------- */
export default function GameDetails({ initialGame }) {
	const [desc, setDesc] = useState(initialGame.game_desc || '')
	const [title, setTitle] = useState(initialGame.game_title || '')
	const [lastSaved, setLastSaved] = useState(initialGame || [])
	const [isEdited, setIsEdited] = useState(false)
	const [isEditing, setIsEditing] = useState(false)

	const router = useRouter()

	//# --------------------- Mutation To Update Game
	const { mutate, isPending } = useMutation({
		mutationKey: ['update-game'],
		mutationFn: ({ gameSlug, title: newTitle, desc: newDesc }) => apiUpdateGame(gameSlug, newTitle, newDesc),
		onSuccess: data => {
			toast.success('Game updated!')

			router.refresh(`/${initialGame.game_slug}`)

			setLastSaved({
				...lastSaved,
				game_title: data.game_title?.trim() || '',
				game_desc: data.game_desc?.trim() || '',
			})

			setIsEdited(false)
			setIsEditing(false)
		},
		onError: err => {
			toast.error('Error: ' + (err.message || 'Failed to update game.'))
			isDev && console.error('Update game mutation error:', err)

			setDesc(lastSaved.game_desc)
			setTitle(lastSaved.game_title)
			setIsEdited(false)
			setIsEditing(false)
		},
	})

	//# -------------------------------- Handlers
	const handleSave = () => {
		//[TODO] create new slug and preview
		if (desc?.trim() === lastSaved.game_desc?.trim() && title?.trim() === lastSaved.game_title?.trim()) {
			setDesc(desc.trim())
			setTitle(title.trim())
			setIsEdited(false)
			setIsEditing(false)
			return
		}
		setDesc(desc.trim())
		setTitle(title.trim())

		if (!title.trim()) {
			toast.error('Missing required Category name!')
			return
		}

		mutate({ gameSlug: initialGame.game_slug, title, desc })
	}

	const handleCancel = () => {
		setIsEdited(false)
		setIsEditing(false)
		setDesc(lastSaved.game_desc) // rollback to last saved
		setTitle(lastSaved.game_title)
	}
	//* --------------------------------- Render --------------------------------- */
	return (
		<div className={cn('w-full flex gap-4 justify-between items-top')}>
			<div className='w-3/4 space-y-8'>
				<div className='flex gap-2 items-center'>
					<label htmlFor='gameName' className='leading-11 w-1/4'>
						<span className='font-semibold'>Category:</span>
					</label>
					{isEditing ? (
						<input
							type='text'
							id='gameName'
							value={sanitizeName(title)}
							onChange={e => {
								setTitle(e.target.value), setIsEdited(true)
							}}
							disabled={isPending}
							className='w-full'
							rows={2}
							required
						/>
					) : (
						<h1 className='text-xl font-bold'>{lastSaved.game_title}</h1>
					)}
				</div>

				<div className='flex gap-2'>
					<label htmlFor='gameDesc' className='w-1/4'>
						<span className='font-semibold mr-2 mb-2 inline-flex'>Description:</span>
					</label>
					{isEditing ? (
						<textarea
							id='gameDesc'
							value={sanitizeDesc(desc)}
							onChange={e => {
								setDesc(e.target.value), setIsEdited(true)
							}}
							disabled={isPending}
							className='w-full'
						/>
					) : (
						lastSaved.game_desc || 'No description provided.'
					)}
				</div>
			</div>

			{isEditing ? (
				<div className='flex gap-2 pb-2'>
					<Button disabled={isPending || !isEdited} onClick={handleSave}>
						Save
					</Button>
					<Button variant='secondary' onClick={handleCancel}>
						Cancel
					</Button>
				</div>
			) : (
				<Button onClick={() => setIsEditing(true)}>
					<Edit className='inline-flex align-text-top mr-0.5' size={16} />
					Edit
				</Button>
			)}
		</div>
	)
}
