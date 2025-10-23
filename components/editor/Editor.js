'use client'

import { BackNavLinks } from '@/app/(pages)/editor/[gameSlug]/[stageSlug]/BackNavLinks'
import { useCallback, useEffect, useRef, useState } from 'react'

import { ImageWithAreas } from '@/components/ImageWithAreas'
import { EditorToolbar } from '@/components/editor/EditorToolbar'
import { BLOB_URL } from '@/config/config'
import { useEditorAreas } from '@/hooks/useEditorAreas'

export default function Editor({ initialStage, mode, gameDB }) {
	const [stageSlug, setStageSlug] = useState('')
	const [gameId, setGameId] = useState(gameDB.game_id)
	const [difficulty, setDifficulty] = useState('')
	const [imageUrl, setImageUrl] = useState(null)
	const [imageFile, setImageFile] = useState(null)
	const [drawMode, setDrawMode] = useState('circle')
	const [radius, setRadius] = useState(25)
	const [modified, setModified] = useState(false)
	const imageRef = useRef(null)

	//* -------- Custom Hook To Manage Drawing/editing Areas On The Image -------- */
	const { areas, setAreas, handleImageClick, handleContextMenu, handleMouseDown, handleMouseMove, handleMouseUp } = useEditorAreas(
		imageRef,
		drawMode,
		radius,
		setModified
	)

	//* ----------------------------- Load initial stage ----------------------------- */
	useEffect(() => {
		if (initialStage) {
			// Set data for editing existing stage or creating new one
			setGameId(initialStage.game_id || gameId)
			setStageSlug(initialStage.stage_slug || '')
			setImageUrl(initialStage.image_path || '')
			setDifficulty(initialStage.difficulty || '')
			setAreas(initialStage.areas || [])
		}
	}, [gameId, initialStage, setAreas])

	//* ---------------------------- Upload New Image ---------------------------- */
	const handleImageUpload = useCallback(
		e => {
			const file = e.target.files?.[0]
			if (!file) return
			// Create temporary preview URL
			const url = URL.createObjectURL(file)
			setImageUrl(url)
			setImageFile(file)
			setAreas([]) // reset areas when new image uploaded
		},
		[setAreas]
	)

	//* ------------ Prepared Object For Saving Or Updating The Stage ------------ */
	const updatedNewStage = {
		gameId,
		stageSlug,
		imageUrl,
		difficulty,
		areas,
	}

	//* ----------------------------- Render ----------------------------- */
	return (
		<div className='space-y-6 w-full border min-h-[90vh]'>
			{/* //# ------------------------ Navigation links (Back to Editor / Home) */}
			<div className='flex justify-end items-center gap-4'>
				<BackNavLinks gameDB={gameDB} modified={modified} />
			</div>
			{/* //# ------------------------ Image uploader (only visible in create mode) */}
			{mode === 'create' && (
				<div className='flex gap-4 justify-center items-center py-4 border'>
					<label className='text-lg'>
						Upload image:
						<input type='file' accept='image/*' onChange={handleImageUpload} />
					</label>
				</div>
			)}

			{/* //# ------------------------ Main editor section */}
			{imageUrl && (
				<div className='flex gap-8 flex-col items-center'>
					<EditorToolbar
						drawMode={drawMode}
						setDrawMode={setDrawMode}
						radius={radius}
						setRadius={setRadius}
						gameSlug={gameDB.game_slug}
						mode={mode}
						modified={modified}
						setModified={setModified}
						imageFile={imageFile}
						stage={updatedNewStage}
					/>

					{/* //# ------------------------ Image preview + clickable areas */}
					<div className='w-full flex justify-center'>
						<ImageWithAreas
							// If creating — use temporary preview; if editing — show from Blob storage
							imageUrl={mode === 'create' ? imageUrl : `${BLOB_URL}${imageUrl}`}
							areas={areas}
							imageRef={imageRef}
							onPointClick={handleImageClick}
							onMouseDown={handleMouseDown}
							onMouseMove={handleMouseMove}
							onMouseUp={handleMouseUp}
							onContextMenu={handleContextMenu}
						/>
					</div>

					{/* //# ------------------------ Output of all drawn areas */}
					<pre className='bg-gray-100 p-4 text-xs max-h-[50vh] overflow-auto'>{JSON.stringify(areas, null, 2)}</pre>
				</div>
			)}
		</div>
	)
}
