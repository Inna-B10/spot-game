'use client'

import { ImageWithAreas } from '@/components/ImageWithAreas'
import { useCallback, useEffect, useRef, useState } from 'react'

export default function PlayGame({ level, game }) {
	const [found, setFound] = useState([])
	const [completed, setCompleted] = useState(false)
	const [justFound, setJustFound] = useState(null)
	const imageRef = useRef(null)

	//# ------------------------ Reset when a new level is loaded
	useEffect(() => {
		setFound([])
		setCompleted(false)
		setJustFound(null)
	}, [level.level_slug])

	//# ------------------------ Handle user click on the image
	const handlePointClick = useCallback(
		({ x, y }) => {
			if (completed) return

			let closest = null
			let minDist = Infinity

			//# ------------------------ Iterate over all areas
			for (const area of level.areas) {
				if (found.includes(area.id)) continue //skip already found areas

				let isHit = false
				let dist = 0

				if (area.type === 'circle') {
					// calculate distance from click point to circle center
					const dx = x - area.x
					const dy = y - area.y
					dist = Math.sqrt(dx * dx + dy * dy)

					// hit if distance ≤ radius
					isHit = dist <= area.radius
				} else if (area.type === 'rect') {
					// check if the click is inside the rectangle boundaries
					const inside = x >= area.x && x <= area.x + area.width && y >= area.y && y <= area.y + area.height
					if (inside) {
						// for rectangles, we measure distance to their center.
						// if multiple areas overlap,
						// we choose the one whose center is closest to the click.
						const centerX = area.x + area.width / 2
						const centerY = area.y + area.height / 2
						dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)
						isHit = true
					}
				}

				// if the clicked point hits an area and it's the nearest one so far — store it
				if (isHit && dist < minDist) {
					minDist = dist
					closest = area
				}
			}

			// if any area was successfully hit
			if (closest) {
				const updated = [...found, closest.id]
				setFound(updated)

				// if all areas are found — mark the level as completed
				if (updated.length === level.areas.length) setCompleted(true)

				// briefly highlight the just-found area
				setJustFound(closest.id)
				setTimeout(() => setJustFound(null), 800)
			}
		},
		[found, level.areas, completed]
	)

	//* -------------------------------- Rendering ------------------------------- */
	return (
		<div className='space-y-6 text-center w-full'>
			{/* //# ------------------------ Progress info */}
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

				{/* //# ------------------------ Level completed message */}
				{completed && (
					<div className='text-green-600 font-bold text-xl mt-6'>
						🎉 Congratulations! <br />
						Level completed!
					</div>
				)}
			</div>

			{/* //# ------------------------ Main game image with clickable areas */}
			<div className='w-full flex justify-center'>
				<ImageWithAreas
					imageUrl={level.image_path}
					areas={level.areas.filter(p => found.includes(p.id))} // show only found areas
					onPointClick={handlePointClick}
					highlightId={justFound}
					imageRef={imageRef}
				/>
			</div>
		</div>
	)
}
