'use client'

import { BackNavLinks } from '@/app/(pages)/editor/[game]/[id]/BackNavLinks'
import { useCallback, useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { EditorToolbar } from './EditorToolbar'
import { ImageWithAreas } from './ImageWithAreas'

export default function Editor({ initialLevel, mode, game }) {
	const [id, setId] = useState('')
	const [imageUrl, setImageUrl] = useState(null)
	const [imageFile, setImageFile] = useState(null)
	const [radius, setRadius] = useState(25)
	const [areas, setAreas] = useState([])
	const [modified, setModified] = useState(false)

	useEffect(() => {
		if (initialLevel) {
			setId(initialLevel.id || '')
			setImageUrl(initialLevel.image || '')
			setAreas(initialLevel.areas || [])
		}
	}, [initialLevel])

	const handleImageUpload = useCallback(e => {
		const file = e.target.files[0]
		if (file) {
			const url = URL.createObjectURL(file)
			setImageUrl(url)
			setImageFile(file)
			setAreas([])
		}
	}, [])

	const handleImageClick = useCallback(
		({ x, y }) => {
			setModified(true)
			setAreas(prev => {
				const existing = prev.find(point => {
					const dx = x - point.x
					const dy = y - point.y
					return Math.sqrt(dx ** 2 + dy ** 2) < point.radius
				})

				if (existing) {
					return prev.filter(point => point.id !== existing.id)
				}

				return [
					...prev,
					{
						id: uuid(),
						x: Math.round(x),
						y: Math.round(y),
						radius: Number(radius),
					},
				]
			})
		},
		[radius, setModified]
	)

	return (
		<div className='space-y-6 w-full'>
			<div className='flex justify-end items-center gap-4'>
				<BackNavLinks game={game} modified={modified} />
			</div>
			{mode === 'create' && (
				<div>
					<label>Upload image: </label>
					<input
						type='file'
						accept='image/*'
						onChange={handleImageUpload}
						className='bg-gray-200 p-2 w-fit rounded border border-gray-400'
					/>
				</div>
			)}

			{imageUrl && (
				<div className='flex gap-8 flex-col items-center'>
					<EditorToolbar
						radius={radius}
						setRadius={setRadius}
						areas={areas}
						game={game}
						mode={mode}
						setModified={setModified}
						id={id}
						imageUrl={imageUrl}
						imageFile={imageFile}
					/>

					<div className='w-full flex justify-center'>
						<ImageWithAreas
							imageUrl={
								mode === 'create' ? imageUrl : `/images/${game}/${imageUrl}`
							}
							areas={areas}
							onPointClick={handleImageClick}
						/>
					</div>

					<pre className='bg-gray-100 p-4 text-xs max-h-[50vh] overflow-auto'>
						{JSON.stringify(areas, null, 2)}
					</pre>
				</div>
			)}
		</div>
	)
}
