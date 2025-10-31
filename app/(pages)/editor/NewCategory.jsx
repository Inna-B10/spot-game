'use client'

import { Button } from '@/components/ui/buttons/Button'
import { updateCachedList } from '@/lib/utils/reactQueryHelpers'
import { createSlug, sanitizeDesc, sanitizeName } from '@/lib/utils/sanitizeInput'
import { apiCreateNewGame } from '@/services/client/gamesClient.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { useState } from 'react'
import { toast } from 'sonner'

/**
 * Client-side React component that provides a form UI to create a new game/category.
 * It maintains local form state, shows a preview step, and submits the sanitized data
 * to an API via a React Query mutation.
 */

export function NewCategory() {
	const [name, setName] = useState('')
	const [desc, setDesc] = useState('')
	const [preview, setPreview] = useState(null)
	const [isUpdated, setIsUpdated] = useState(false)
	const queryClient = useQueryClient()
	const router = useRouter()

	//# ----------------------- mutation to create new game
	const { mutate, isPending } = useMutation({
		mutationKey: ['create-new-game'],
		mutationFn: ({ title, gameSlug, desc }) => apiCreateNewGame({ title, gameSlug, desc }),
		onSuccess: newGame => {
			toast.success('Game created successfully!')

			// instantly add new game to cached list
			updateCachedList(queryClient, ['get-all-games'], newGame, 'add')
			queryClient.invalidateQueries({ queryKey: ['get-all-games'] })

			router.refresh('/')

			setPreview(null)
			setName('')
			setDesc('')
		},
		onError: err => {
			toast.error('Error: ' + (err.message || 'Failed to create new game'))
			isDev && console.error('Create stage mutation error:', err)
		},
		onSettled: () => {
			setIsUpdated(false)
		},
	})

	//# ----------------------- change input
	const handleChange = e => {
		setIsUpdated(true)
		const { id, value } = e.target
		if (id === 'gameName') setName(sanitizeName(value))
		if (id === 'gameDesc') setDesc(sanitizeDesc(value))
	}

	const handleCreatePreview = () => {
		if (!name.trim()) {
			toast.error('Game name cannot be empty!')
			return
		}
		setName(name.trim())
		setDesc(desc.trim())

		//# ----------------------- create slug
		const gameSlug = createSlug(sanitizeName(name).trim())

		//# ----------------------- show preview instead of immediate save
		setPreview({ name, gameSlug, desc })
		setIsUpdated(false)
	}

	//# ----------------------- submit
	async function handleSubmit(e) {
		e.preventDefault()

		if (isUpdated) {
			toast.warning('Click Create Preview and check that name and description look correct before saving.')
			return
		}

		if (!preview?.name.trim() || !preview?.gameSlug.trim()) {
			toast.error('Missing required parameters!')
			return
		}

		//# ----------------------- update DB
		mutate({ title: preview.name.trim(), gameSlug: preview.gameSlug.trim(), desc: preview.desc.trim() })
	}

	//* --------------------------------- Render --------------------------------- */
	return (
		<>
			<h2 className='text-2xl font-semibold  mb-2'>Create new category</h2>

			<form onSubmit={handleSubmit}>
				<div className='w-full flex justify-between gap-8'>
					<div className='w-1/2 flex flex-col gap-4'>
						{/* //# ---------------------------------Input */}
						<label htmlFor='gameName'>
							<input type='text' id='gameName' placeholder='Write name...' className='w-full' value={name} onChange={handleChange} disabled={isPending} />
						</label>
						<label htmlFor='gameDesc'>
							<textarea id='gameDesc' value={desc} onChange={handleChange} placeholder='Write short description...' className='w-full h-full' disabled={isPending} />
						</label>
					</div>
					<div className='w-1/2 flex flex-col gap-4 justify-between'>
						<p>
							Add a short <strong>general</strong> description for this game category.
							<br />
							You can add individual task instructions later during stage creation.
						</p>
						<Button type='button' disabled={!isUpdated} onClick={handleCreatePreview} variant='primary' aria-label='Create new category'>
							Create preview
						</Button>
					</div>
				</div>

				{/* //# --------------------------------- Preview */}
				{preview && (
					<div className='w-full flex flex-col mt-8'>
						<h2 className='text-2xl font-semibold  mb-2'>Preview</h2>
						<span>
							<strong>game_title:</strong> {preview?.name}
						</span>
						<span>
							<strong>game_slug:</strong> {preview?.gameSlug}
						</span>
						<span>
							<strong>game_desc:</strong> {preview?.desc}
						</span>
					</div>
				)}
				{/* //# ---------------------------------- Save */}
				<div className='w-full flex gap-2 justify-center mt-8'>
					<Button type='submit' disabled={!preview || isUpdated || isPending}>
						Confirm & Save
					</Button>
				</div>
			</form>
		</>
	)
}
