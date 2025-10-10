'use client'

import { ImageWithAreas } from '@/components/ImageWithAreas'
import { useCallback, useEffect, useRef, useState } from 'react'

export default function PlayGame({ level, game }) {
	const [found, setFound] = useState([])
	const [completed, setCompleted] = useState(false)
	const [justFound, setJustFound] = useState(null)
	const imageRef = useRef(null)

	useEffect(() => {
		setFound([])
		setCompleted(false)
		setJustFound(null)
	}, [level.id])

	const handlePointClick = useCallback(
		({ x, y }) => {
			if (completed) return

			let closest = null
			let minDist = Infinity

			for (const diff of level.areas) {
				if (found.includes(diff.id)) continue

				let isHit = false
				let dist = 0

				if (diff.type === 'circle') {
					const dx = x - diff.x
					const dy = y - diff.y
					dist = Math.sqrt(dx * dx + dy * dy)
					isHit = dist <= diff.radius
				} else if (diff.type === 'rect') {
					const inside = x >= diff.x && x <= diff.x + diff.width && y >= diff.y && y <= diff.y + diff.height
					if (inside) {
						// distance to the center of the rectangle
						const centerX = diff.x + diff.width / 2
						const centerY = diff.y + diff.height / 2
						dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)
						isHit = true
					}
				}

				if (isHit && dist < minDist) {
					minDist = dist
					closest = diff
				}
			}

			if (closest) {
				const updated = [...found, closest.id]
				setFound(updated)
				if (updated.length === level.areas.length) setCompleted(true)
				setJustFound(closest.id)
				setTimeout(() => setJustFound(null), 800)
			}
		},
		[found, level.areas, completed]
	)

	return (
		<div className='space-y-6 text-center w-full'>
			<div className='min-h-30'>
				{game === 'find-pair' ? (
					<p>
						Found: {found.length % 2 > 0 ? (found.length - 1) / 2 : found.length / 2} of {level.areas.length / 2}
					</p>
				) : (
					<p>
						Found: {found.length} of {level.areas.length}
					</p>
				)}

				{completed && (
					<div className='text-green-600 font-bold text-xl mt-6'>
						🎉 Congratulations! <br />
						Level completed!
					</div>
				)}
			</div>
			<div className='w-full flex justify-center'>
				<ImageWithAreas
					imageUrl={`/images/${game}/${level.image}`}
					areas={level.areas.filter(p => found.includes(p.id))}
					onPointClick={handlePointClick}
					highlightId={justFound}
					imageRef={imageRef}
				/>
			</div>
		</div>
	)
}
