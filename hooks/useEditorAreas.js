import { getRelativeCoordsPx, isPointInArea } from '@/components/editor/areaUtils'
import { useCallback, useState } from 'react'
import { v4 as uuid } from 'uuid'

export function useEditorAreas(imageRef, drawMode, radius, setModified) {
	const [areas, setAreas] = useState([])
	const [isDragging, setIsDragging] = useState(false)
	const [rectStart, setRectStart] = useState(null)

	//* ----------------------------- Left click to create new circle ----------------------------- */
	const handleImageClick = useCallback(
		({ x, y }) => {
			setModified(true)

			setAreas(prev => {
				// check if click is inside existing area (circle or rect)
				if (prev.some(area => isPointInArea(x, y, area))) return prev

				// add new circle
				if (drawMode === 'circle') {
					return [...prev, { id: uuid(), x, y, type: 'circle', radius: Number(radius) }]
				}

				// for rect mode —> only drawing via drag, not click
				return prev
			})
		},
		[drawMode, radius, setModified]
	)

	//* ----------------------------- Right click to delete area ----------------------------- */
	const handleContextMenu = useCallback(
		e => {
			e.preventDefault()

			if (!imageRef.current) return
			const { x, y } = getRelativeCoordsPx(e, imageRef)

			setAreas(prev => {
				// find area under right-click
				const existing = prev.find(a => isPointInArea(x, y, a))
				if (!existing) return prev

				// if found — delete it and mark as modified
				setModified(true)
				return prev.filter(a => a.id !== existing.id)
			})
		},
		[imageRef, setModified]
	)

	//* ----------------------------- Rectangle drawing (drag & drop) ----------------------------- */
	const handleMouseDown = e => {
		if (drawMode !== 'rect') return

		const { x, y } = getRelativeCoordsPx(e, imageRef)

		// check if starting point is inside an existing area (to avoid overlaps), cancel drawing if true
		if (areas.some(a => isPointInArea(x, y, a))) return

		setIsDragging(true)
		setRectStart({ x, y })
	}
	//# ------------------------------- Mouse Move
	const handleMouseMove = e => {
		if (!isDragging || drawMode !== 'rect') return

		const { x, y } = getRelativeCoordsPx(e, imageRef)

		// create temporary rectangle preview
		const newRect = {
			id: 'temp',
			x: Math.min(rectStart.x, x),
			y: Math.min(rectStart.y, y),
			type: 'rect',
			width: Math.abs(x - rectStart.x),
			height: Math.abs(y - rectStart.y),
		}
		// update temp rectangle
		setAreas(prev => [...prev.filter(a => a.id !== 'temp'), newRect])
	}

	//# ------------------------------- Mouse Up
	const handleMouseUp = () => {
		if (!isDragging || drawMode !== 'rect') return
		setIsDragging(false)
		setRectStart(null)

		setAreas(prev => {
			const temp = prev.find(a => a.id === 'temp')
			if (!temp) return prev // nothing drawn — skip

			// remove too small rectangles
			if (temp.width <= 5 || temp.height <= 5) return prev.filter(a => a.id !== 'temp')

			setModified(true)
			return [
				...prev.filter(a => a.id !== 'temp'),
				{ ...temp, id: uuid() }, // finalize the rectangle
			]
		})
	}

	return {
		areas,
		setAreas,
		handleImageClick,
		handleContextMenu,
		handleMouseDown,
		handleMouseMove,
		handleMouseUp,
	}
}
