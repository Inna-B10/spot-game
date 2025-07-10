'use client'

import { useEffect, useRef, useState } from 'react'

export default function PlayDifference({ object, game }) {
	const imageRef = useRef(null)
	const [found, setFound] = useState([])
	const [completed, setCompleted] = useState(false)
	const [justFound, setJustFound] = useState(null)

	useEffect(() => {
		setFound([])
		setCompleted(false)
		setJustFound(null)
	}, [object.id])

	function handleClick(event) {
		if (!imageRef.current) return

		const rect = imageRef.current.getBoundingClientRect()
		const x = event.clientX - rect.left
		const y = event.clientY - rect.top

		for (const diff of object.points) {
			if (found.includes(diff.id)) continue

			const dx = x - diff.x
			const dy = y - diff.y
			const distance = Math.sqrt(dx * dx + dy * dy)

			if (distance <= diff.radius) {
				setFound(prev => {
					const updated = [...prev, diff.id]
					if (updated.length === object.points.length) {
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
		<div className='flex justify-center items-center gap-20 w-full max-h-[70vh] border'>
			<div className='w-fit flex justify-center items-center'>
				<div
					className='relative border cursor-pointer content-center border-red-500 w-fit flex justify-center items-center'
					onClick={handleClick}>
					{/* next/image does not support correctly ref */}
					<img
						ref={imageRef}
						src={`/images/${game}/${object.image}`}
						alt={object.image}
						className='max-w-full max-h-full'
						draggable='false'
					/>
					{found.map(id => {
						const diff = object.points.find(d => d.id === id)
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
			<div>
				<p>
					Найдено отличий: {found.length} из {object.points.length}
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
