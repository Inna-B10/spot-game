'use client'

import { useEffect, useRef, useState } from 'react'

export default function PlayFind({ level, game }) {
	const imageRef = useRef(null)
	const [found, setFound] = useState([])
	const [completed, setCompleted] = useState(false)
	const [justFound, setJustFound] = useState(null)

	useEffect(() => {
		setFound([])
		setCompleted(false)
		setJustFound(null)
	}, [level.id])

	function handleClick(event) {
		if (!imageRef.current) return

		const rect = imageRef.current.getBoundingClientRect()
		const x = event.clientX - rect.left
		const y = event.clientY - rect.top

		for (const diff of level.points) {
			if (found.includes(diff.id)) continue

			const dx = x - diff.x
			const dy = y - diff.y
			const distance = Math.sqrt(dx * dx + dy * dy)

			if (distance <= diff.radius) {
				setFound(prev => {
					const updated = [...prev, diff.id]
					if (updated.length === level.points.length) {
						setCompleted(true)
					}
					return updated
				})
				setJustFound(diff.id)
				setTimeout(() => setJustFound(null), 800)
				break
			}
		}
	}

	return (
		<div className='space-y-6 text-center w-full'>
			<div>
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
			<div className='w-fit flex justify-center items-center'>
				<div
					className='relative border cursor-pointer content-center border-red-500 w-fit '
					onClick={handleClick}>
					{/* next/image does not support correctly ref */}
					<img
						ref={imageRef}
						src={`/images/${game}/${level.image}`}
						alt={level.image}
						className='max-w-[900px] h-auto'
						draggable='false'
					/>
					{found.map(id => {
						const diff = level.points.find(d => d.id === id)
						const isRecent = justFound === id
						return (
							<div
								key={id}
								className={`absolute border-2 rounded-full pointer-events-none ${
									isRecent
										? 'border-green-500 animate-ping'
										: 'border-green-600'
								}`}
								style={{
									left: diff.x - diff.radius,
									top: diff.y - diff.radius,
									width: diff.radius * 2,
									height: diff.radius * 2,
								}}
							/>
						)
					})}
				</div>
			</div>
		</div>
	)
}
