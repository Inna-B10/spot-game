'use client'

import { useCallback, useEffect, useState } from 'react'
import { ImageWithPoints } from './ImageWithPoints'

export default function PlayFind({ level, game }) {
	const [found, setFound] = useState([])
	const [completed, setCompleted] = useState(false)
	const [justFound, setJustFound] = useState(null)

	useEffect(() => {
		setFound([])
		setCompleted(false)
		setJustFound(null)
	}, [level.id])

	const handlePointClick = useCallback(
		({ x, y }) => {
			if (completed) return

			for (const diff of level.points) {
				if (found.includes(diff.id)) continue

				const dx = x - diff.x
				const dy = y - diff.y
				const distance = Math.sqrt(dx * dx + dy * dy)

				if (distance <= diff.radius) {
					const updated = [...found, diff.id]
					setFound(updated)
					if (updated.length === level.points.length) setCompleted(true)
					setJustFound(diff.id)
					setTimeout(() => setJustFound(null), 800)
					break
				}
			}
		},
		[found, level.points, completed]
	)

	return (
		<div className='space-y-6 text-center w-full'>
			<div className='min-h-30'>
				{game === 'find-pair' ? (
					<p>
						Найдено:{' '}
						{found.length % 2 > 0 ? (found.length - 1) / 2 : found.length / 2}{' '}
						из {level.points.length / 2}
					</p>
				) : (
					<p>
						Найдено: {found.length} из {level.points.length}
					</p>
				)}

				{completed && (
					<div className='text-green-600 font-bold text-xl mt-6'>
						🎉 Поздравляем! <br />
						Уровень пройден!
					</div>
				)}
			</div>
			<div className='w-full flex justify-center'>
				<ImageWithPoints
					imageUrl={`/images/${game}/${level.image}`}
					points={level.points.filter(p => found.includes(p.id))}
					onPointClick={handlePointClick}
					highlightId={justFound}
				/>
			</div>
		</div>
	)
}
