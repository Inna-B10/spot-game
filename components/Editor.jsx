'use client'

import { BackNavLinks } from '@/app/(pages)/editor/[game]/[id]/BackNavLinks'
import { useCallback, useEffect, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { EditorToolbar } from './EditorToolbar'
import { ImageWithAreas } from './ImageWithAreas'

export default function Editor({ initialLevel, mode, game }) {
	const [id, setId] = useState('')
	const [imageUrl, setImageUrl] = useState(null)
	const [imageFile, setImageFile] = useState(null)
	const [areas, setAreas] = useState([])
	const [drawMode, setDrawMode] = useState('circle') // 'circle' or 'rect'
	const [isDragging, setIsDragging] = useState(false)
	const [rectStart, setRectStart] = useState({ x: 0, y: 0 })
	const [radius, setRadius] = useState(25)
	const [modified, setModified] = useState(false)
	const imageRef = useRef(null)

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

	// удаление областей по правому клику мыши
	const handleContextMenu = useCallback(e => {
		e.preventDefault() // отключаем стандартное меню

		if (!imageRef.current) return
		const rect = imageRef.current.getBoundingClientRect()
		const x = e.clientX - rect.left
		const y = e.clientY - rect.top

		setAreas(prev => {
			const existing = prev.find(area => {
				if (area.type === 'circle') {
					const dx = x - area.x
					const dy = y - area.y
					return Math.sqrt(dx ** 2 + dy ** 2) < area.radius
				}
				if (area.type === 'rect') {
					return x >= area.x && x <= area.x + area.width && y >= area.y && y <= area.y + area.height
				}
				return false
			})

			if (existing) {
				return prev.filter(area => area.id !== existing.id)
			}
			return prev
		})
	}, [])

	const handleImageClick = useCallback(
		({ x, y }) => {
			setModified(true)

			setAreas(prev => {
				// Проверяем, попал ли клик в какой-то существующий круг или прямоугольник
				const existing = prev.find(area => {
					if (area.type === 'circle') {
						const dx = x - area.x
						const dy = y - area.y
						return Math.sqrt(dx ** 2 + dy ** 2) < area.radius
					}
					if (area.type === 'rect') {
						return x >= area.x && x <= area.x + area.width && y >= area.y && y <= area.y + area.height
					}
					return false
				})
				// если попали в область - ничего не рисуем
				if (existing) {
					return prev
				}

				// Если drawMode === 'circle', добавляем новый круг
				if (drawMode === 'circle') {
					return [
						...prev,
						{
							id: uuid(),
							x: Math.round(x),
							y: Math.round(y),
							type: 'circle',
							radius: Number(radius),
						},
					]
				}

				// Если drawMode === 'rect', ничего не создаём на клик, только drag
				return prev
			})
		},
		[drawMode, radius]
	)

	// Drag and drop for rectangle drawing
	const handleMouseDown = e => {
		if (drawMode !== 'rect') return
		const { x, y } = getRelativeCoordsPx(e)

		// Ищем существующую область
		const existing = areas.find(area => {
			if (area.type === 'circle') {
				const dx = x - area.x
				const dy = y - area.y
				return Math.sqrt(dx * dx + dy * dy) < area.radius
			}
			if (area.type === 'rect') {
				return x >= area.x && x <= area.x + area.width && y >= area.y && y <= area.y + area.height
			}
			return false
		})

		// Если попали внутрь существующей области — не начинаем рисовать
		if (existing) return

		setIsDragging(true)
		setRectStart({ x, y })
	}

	const handleMouseMove = e => {
		if (!isDragging || drawMode !== 'rect') return
		const { x, y } = getRelativeCoordsPx(e)
		const newRect = {
			id: 'temp',
			x: Math.min(rectStart.x, x),
			y: Math.min(rectStart.y, y),
			type: 'rect',
			width: Math.abs(x - rectStart.x),
			height: Math.abs(y - rectStart.y),
		}
		setAreas(prev => [...prev.filter(a => a.id !== 'temp'), newRect])
	}

	const handleMouseUp = e => {
		if (!isDragging || drawMode !== 'rect') return
		setIsDragging(false)
		setRectStart(null)

		setAreas(prev => {
			const temp = prev.find(a => a.id === 'temp')
			if (!temp) return prev // ничего не рисовали — выходим
			if (temp.width <= 5 || temp.height <= 5) {
				return [...prev.filter(a => a.id !== 'temp')]
			}
			return [
				...prev.filter(a => a.id !== 'temp'),
				{ ...temp, id: uuid() }, // превращаем во "взрослый" rect
			]
		})
	}
	console.log('areas', areas)
	// Преобразуем координаты мыши в проценты относительно картинки
	const getRelativeCoordsPx = e => {
		const rect = imageRef.current.getBoundingClientRect()
		const x = e.clientX - rect.left
		const y = e.clientY - rect.top
		return { x, y }
	}

	return (
		<div className='space-y-6 w-full'>
			<div className='flex justify-end items-center gap-4'>
				<BackNavLinks game={game} modified={modified} />
			</div>
			{mode === 'create' && (
				<div>
					<label>Upload image: </label>
					<input type='file' accept='image/*' onChange={handleImageUpload} className='bg-gray-200 p-2 w-fit rounded border border-gray-400' />
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

					<pre className='bg-gray-100 p-4 text-xs max-h-[50vh] overflow-auto'>{JSON.stringify(areas, null, 2)}</pre>
				</div>
			)}
		</div>
	)
}
