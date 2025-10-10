'use client'

import { BackNavLinks } from '@/app/(pages)/editor/[game]/[id]/BackNavLinks'
import { useCallback, useEffect, useRef, useState } from 'react'

import { ImageWithAreas } from '@/components/ImageWithAreas'
import { EditorToolbar } from '@/components/editor/EditorToolbar'
import { useEditorAreas } from '@/hooks/useEditorAreas'

export default function Editor({ initialLevel, mode, game }) {
	const [id, setId] = useState('')
	const [imageUrl, setImageUrl] = useState(null)
	const [imageFile, setImageFile] = useState(null)
	const [drawMode, setDrawMode] = useState('circle')
	const [radius, setRadius] = useState(25)
	const [modified, setModified] = useState(false)
	const imageRef = useRef(null)

	const { areas, setAreas, handleImageClick, handleContextMenu, handleMouseDown, handleMouseMove, handleMouseUp } = useEditorAreas(
		imageRef,
		drawMode,
		radius,
		setModified
	)

	//* ----------------------------- Load initial level ----------------------------- */
	useEffect(() => {
		if (initialLevel) {
			setId(initialLevel.id || '')
			setImageUrl(initialLevel.image || '')
			setAreas(initialLevel.areas || [])
		}
	}, [initialLevel, setAreas])

	//* ----------------------------- Upload image ----------------------------- */
	const handleImageUpload = useCallback(
		e => {
			const file = e.target.files[0]
			if (!file) return
			const url = URL.createObjectURL(file)
			setImageUrl(url)
			setImageFile(file)
			setAreas([]) // reset areas when new image uploaded
		},
		[setAreas]
	)

	//* ----------------------------- Render ----------------------------- */
	return (
		<div className='space-y-6 w-full border min-h-[90vh]'>
			<div className='flex justify-end items-center gap-4'>
				<BackNavLinks game={game} modified={modified} />
			</div>

			{mode === 'create' && (
				<div className='flex gap-4 justify-center items-center py-4 border'>
					<label className='text-lg'>Upload image: </label>
					<input type='file' accept='image/*' onChange={handleImageUpload} className='bg-gray-200 p-2 rounded border border-gray-400' />
				</div>
			)}

			{imageUrl && (
				<div className='flex gap-8 flex-col items-center'>
					<EditorToolbar
						setDrawMode={setDrawMode}
						drawMode={drawMode}
						radius={radius}
						setRadius={setRadius}
						areas={areas}
						game={game}
						mode={mode}
						modified={modified}
						setModified={setModified}
						id={id}
						imageUrl={imageUrl}
						imageFile={imageFile}
					/>

					<div className='w-full flex justify-center'>
						<ImageWithAreas
							imageUrl={mode === 'create' ? imageUrl : `/images/${game}/${imageUrl}`}
							areas={areas}
							imageRef={imageRef}
							onPointClick={handleImageClick}
							onMouseDown={handleMouseDown}
							onMouseMove={handleMouseMove}
							onMouseUp={handleMouseUp}
							onContextMenu={handleContextMenu}
						/>
					</div>

					<pre className='bg-gray-100 p-4 text-xs max-h-[50vh] overflow-auto text-left'>{JSON.stringify(areas, null, 2)}</pre>
				</div>
			)}
		</div>
	)
}
