'use client'

import { useEffect, useRef, useState } from 'react'

export default function PlayLevel({ level }) {
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

		for (const diff of level.differences) {
			if (found.includes(diff.id)) continue

			const dx = x - diff.x
			const dy = y - diff.y
			const distance = Math.sqrt(dx * dx + dy * dy)

			if (distance <= diff.radius) {
				setFound(prev => {
					const updated = [...prev, diff.id]
					if (updated.length === level.differences.length) {
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
		<div className='space-y-4'>
			<div className='relative inline-block' onClick={handleClick}>
				<img
					ref={imageRef}
					src={`/images/differences/${level.image}`}
					alt='Level'
					className='max-w-full border'
				/>
				{found.map(id => {
					const diff = level.differences.find(d => d.id === id)
					const isRecent = justFound === id
					return (
						<div
							key={id}
							className={`absolute border-2 rounded-full pointer-events-none ${
								isRecent ? 'border-green-500 animate-ping' : 'border-green-600'
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

			<div>
				<p>
					Найдено отличий: {found.length} из {level.differences.length}
				</p>
				{completed && (
					<div className='text-green-600 font-bold text-xl mt-4'>
						🎉 Поздравляем! Все отличия найдены!
					</div>
				)}
			</div>
		</div>
	)
}
