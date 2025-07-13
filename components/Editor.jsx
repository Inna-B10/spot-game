'use client'

import { useCallback, useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { EditorToolbar } from './EditorToolbar'
import { ImageWithPoints } from './ImageWithPoints'

export default function Editor({ initialLevel, mode, game, setModified }) {
	const [id, setId] = useState('')
	const [imageUrl, setImageUrl] = useState(null)
	const [imageFile, setImageFile] = useState(null)
	const [radius, setRadius] = useState(25)
	const [points, setPoints] = useState([])

	useEffect(() => {
		if (initialLevel) {
			setId(initialLevel.id || '')
			setImageUrl(initialLevel.image || '')
			setPoints(initialLevel.points || [])
		}
	}, [initialLevel])

	const handleImageUpload = useCallback(e => {
		const file = e.target.files[0]
		if (file) {
			const url = URL.createObjectURL(file)
			setImageUrl(url)
			setImageFile(file)
			setPoints([])
		}
	}, [])

	const handleImageClick = useCallback(
		({ x, y }) => {
			setModified(true)
			setPoints(prev => {
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
			{mode === 'create' && (
				<div>
					<label>Upload image:</label>
					<input type='file' accept='image/*' onChange={handleImageUpload} />
				</div>
			)}

			{imageUrl && (
				<div className='flex gap-8 flex-col items-center'>
					<EditorToolbar
						radius={radius}
						setRadius={setRadius}
						points={points}
						game={game}
						mode={mode}
						setModified={setModified}
						id={id}
						imageUrl={imageUrl}
					/>

					<div className='w-full flex justify-center'>
						<ImageWithPoints
							imageUrl={
								mode === 'create' ? imageUrl : `/images/${game}/${imageUrl}`
							}
							points={points}
							onPointClick={handleImageClick}
						/>
					</div>

					<pre className='bg-gray-100 p-4 text-xs max-h-[50vh] overflow-auto'>
						{JSON.stringify(points, null, 2)}
					</pre>
				</div>
			)}
		</div>
	)
}
