'use client'

import { useCallback, useEffect, useState } from 'react'
import { ImageWithAreas } from './ImageWithAreas'

export default function PlayGameFind({ level, game }) {
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

			for (const diff of level.areas) {
				if (found.includes(diff.id)) continue

				const dx = x - diff.x
				const dy = y - diff.y
				const distance = Math.sqrt(dx * dx + dy * dy)

				if (distance <= diff.radius) {
					const updated = [...found, diff.id]
					setFound(updated)
					if (updated.length === level.areas.length) setCompleted(true)
					setJustFound(diff.id)
					setTimeout(() => setJustFound(null), 800)
					break
				}
			}
		},
		[found, level.areas, completed]
	)

	return (
		<div className='space-y-6 text-center w-full'>
			<div className='min-h-30'>
				{game === 'find-pair' ? (
					<p>
						Найдено:{' '}
						{found.length % 2 > 0 ? (found.length - 1) / 2 : found.length / 2}{' '}
						из {level.areas.length / 2}
					</p>
				) : (
					<p>
						Найдено: {found.length} из {level.areas.length}
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
				<ImageWithAreas
					imageUrl={`/images/${game}/${level.image}`}
					areas={level.areas.filter(p => found.includes(p.id))}
					onPointClick={handlePointClick}
					highlightId={justFound}
				/>
			</div>
		</div>
	)
}
