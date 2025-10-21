'use client'

import { Button } from '@/components/ui/buttons/Button'
import { createSlug, sanitizeDesc, sanitizeName } from '@/lib/utils/sanitizeInput'
import { apiCreateNewGame } from '@/services/client/gamesClient.service'
import { useState } from 'react'

export function NewCategory({ setIsAddedNew }) {
	const [name, setName] = useState('')
	const [desc, setDesc] = useState('')
	const [preview, setPreview] = useState(null)
	const [isUpdated, setIsUpdated] = useState(false)

	//# ----------- change input
	const handleChange = e => {
		setIsUpdated(true)
		const { name, value } = e.target
		if (name === 'gameName') setName(value)
		if (name === 'gameDesc') setDesc(value)
	}

	const handleCreatePreview = () => {
		if (!name.trim()) {
			alert('Game name cannot be empty!')
			return
		}

		//# ----------- sanitize input
		const newGameName = sanitizeName(name)
		const newGameDesc = sanitizeDesc(desc)

		//# ----------- create slug
		const gameSlug = createSlug(newGameName)

		//# ----------- show preview instead of immediate save
		setPreview({
			name: newGameName,
			slug: gameSlug,
			desc: newGameDesc,
		})
		setIsUpdated(false)
	}

	//# ----------- submit
	async function handleSubmit(e) {
		e.preventDefault()

		if (isUpdated) {
			alert('Click Create Preview and check that name and description look correct before saving.')
			return
		}
		if (!preview?.name.trim() || !preview?.slug.trim()) {
			alert('Missing required parameters!')
			return
		}

		//# ----------- update DB
		const res = await apiCreateNewGame({
			title: preview.name.trim(),
			slug: preview.slug.trim(),
			desc: preview.desc.trim(),
		})
		if (res.success) {
			alert('Game created successfully!')
			setPreview(null)
			setName('')
			setDesc('')
			setIsAddedNew(true)
		} else {
			alert(`Error: ${res.error}\n\n*Name must be unique!\nCheck name and try again.`)
		}
	}

	//* --------------------------------- Render --------------------------------- */
	return (
		<>
			<h2 className='text-2xl font-semibold'>Create new category</h2>

			<form onSubmit={handleSubmit}>
				<div className='w-full flex justify-between gap-8'>
					<div className='w-1/2 flex flex-col gap-4'>
						<input type='text' name='gameName' placeholder='Write name...' className='w-full' value={name} onChange={handleChange} />
						<textarea name='gameDesc' value={desc} onChange={handleChange} placeholder='Write short description...' className='w-full h-full' />
					</div>
					<div className='w-1/2 flex flex-col gap-4 justify-between'>
						<p>
							Add a short <strong>general</strong> description for this game category.
							<br />
							You can add individual task instructions later during stage creation.
						</p>
						<Button type='button' onClick={handleCreatePreview} variant='primary' aria-label='Create new category'>
							Create preview
						</Button>
					</div>
				</div>

				{/* //# --------------------------------- Preview */}
				{preview && (
					<div className='w-full flex flex-col'>
						<h2 className='text-2xl font-semibold'>Preview</h2>
						<span>
							<strong>game_title:</strong> {preview?.name}
						</span>
						<span>
							<strong>game_slug:</strong> {preview?.slug}
						</span>
						<span>
							<strong>game_desc:</strong> {preview?.desc}
						</span>
					</div>
				)}
				{/* //# ---------------------------------- Save */}
				<div className='w-full flex gap-2 justify-center mt-8'>
					<Button type='submit' disabled={!preview || isUpdated}>
						Confirm & Save
					</Button>
				</div>
			</form>
		</>
	)
}
