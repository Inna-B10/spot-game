'use client'

import { GAMES } from '@/constants/games'
import { useEffect, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'

export default function Editor({ initialLevel, mode, game, setModified }) {
	const [id, setId] = useState('')
	const [imageUrl, setImageUrl] = useState(null)
	const [imageFile, setImageFile] = useState(null)
	const [radius, setRadius] = useState(25)
	const [points, setPoints] = useState([])
	const imageRef = useRef(null)

	useEffect(() => {
		if (initialLevel) {
			setId(initialLevel.id || '')
			setImageUrl(initialLevel.image || '')
			setPoints(initialLevel.points || [])
		}
	}, [initialLevel])

	const [status, setStatus] = useState('')

	function handleImageUpload(e) {
		const file = e.target.files[0]
		if (file) {
			const url = URL.createObjectURL(file)
			setImageUrl(url)
			setImageFile(file)
			setPoints([])
		}
	}

	function handleClick(event) {
		if (!imageRef.current) return

		setModified(true)

		const rect = imageRef.current.getBoundingClientRect()
		const x = event.clientX - rect.left
		const y = event.clientY - rect.top

		let removed = false

		const updated = points.filter(diff => {
			const dx = x - diff.x
			const dy = y - diff.y
			const distance = Math.sqrt(dx * dx + dy * dy)
			if (distance < diff.radius) {
				removed = true
				return false
			}
			return true
		})

		if (removed) {
			setPoints(updated)
		} else {
			const newDiff = {
				id: uuid(),
				x: Math.round(x),
				y: Math.round(y),
				radius: Number(radius),
			}
			setPoints(prev => [...prev, newDiff])
		}
	}

	async function handleSave(game) {
		if (mode === 'create') {
			if (!imageFile || points.length === 0) {
				alert('Fill in all fields and upload the image')
				setStatus('❌ Failed to save')
				return
			}

			const formData = new FormData()
			formData.append('file', imageFile)
			formData.append('name', 'image')
			formData.append('points', JSON.stringify(points))

			try {
				setStatus('📤 Saving...')
				const res = await fetch(`/api/create-level?game=${game}`, {
					method: 'POST',
					body: formData,
				})
				const data = await res.json()

				if (res.ok) {
					setStatus('✅ Level saved')
					alert(`Level saved! File: ${data.file}`)
				} else {
					setStatus('❌ Error')
					alert('Error: ' + data.error)
				}
			} catch (e) {
				setStatus('❌ Server error')
				alert('Error: ' + e.message)
			}
		} else {
			// mode === 'edit'
			if (!id || !imageUrl || points.length === 0) {
				alert('Missing fields')
				setStatus('❌ Failed to save')
				return
			}

			const updatedLevel = { id, image: imageUrl, points }

			try {
				setStatus('💾 Saving...')
				const res = await fetch('/api/update-level', {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ game, id, updatedLevel }),
				})

				if (!res.ok) throw new Error()

				setStatus('✅ Updated')
				alert('Level updated!')
				setModified(false)
			} catch (e) {
				setStatus('❌ Failed to update')
				alert('Error while updating')
			}
		}
	}

	return (
		<div className='space-y-6 w-full'>
			{mode === 'create' && (
				<div>
					<label>Upload image:</label>
					<input type='file' accept='image/*' onChange={handleImageUpload} />
				</div>
			)}

			{imageUrl && (
				<div className='flex gap-8 flex-col items-center'>
					<div className='w-full flex gap-4 justify-between'>
						<label className='flex flex-col lg:flex-row lg:items-center gap-2'>
							Radius:
							<input
								type='number'
								value={radius}
								onChange={e => setRadius(e.target.value)}
								className=' border p-1 w-15 text-right'
							/>
						</label>
						<div className='flex justify-center items-center'>
							{game === 'find-pair'
								? points?.length % 2 > 0
									? `${(points?.length - 1) / 2} pairs + 1 point`
									: `${points?.length / 2} pairs`
								: `${points?.length} points`}
						</div>
						{mode === 'create' ? (
							<div className='flex gap-2 items-center'>
								{GAMES.map(g => (
									<button
										onClick={() => handleSave(g.game)}
										className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
										Save to {g.label}
									</button>
								))}
							</div>
						) : (
							<button
								onClick={() => handleSave(game)}
								className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
								Save
							</button>
						)}
					</div>
					<div
						className='relative border content-center border-red-500 w-fit'
						onClick={handleClick}>
						<img
							ref={imageRef}
							src={mode === 'create' ? imageUrl : `/images/${game}/${imageUrl}`}
							alt='preview'
							className='max-w-[900px] h-auto cursor-crosshair'
						/>
						{points.map(diff => (
							<div
								key={diff.id}
								className='absolute border-2 border-red-500 rounded-full pointer-events-none'
								style={{
									left: diff.x - diff.radius,
									top: diff.y - diff.radius,
									width: diff.radius * 2,
									height: diff.radius * 2,
								}}
								title='Нажмите, чтобы удалить'
							/>
						))}
					</div>

					<pre className='bg-gray-100 p-4 text-xs max-h-[50vh] overflow-auto'>
						{JSON.stringify(points, null, 2)}
					</pre>
				</div>
			)}
			<p className='text-sm text-gray-600'>{status}</p>
		</div>
	)
}
