import { useRef } from 'react'

export function ImageWithPoints({
	imageUrl,
	points,
	onPointClick,
	highlightId,
}) {
	const imageRef = useRef(null)

	const handleClick = e => {
		if (!imageRef.current) return
		const rect = imageRef.current.getBoundingClientRect()
		const x = e.clientX - rect.left
		const y = e.clientY - rect.top
		onPointClick({ x, y })
	}

	return (
		<div className='relative content-center w-fit' onClick={handleClick}>
			{/* next/image does not support correctly ref */}
			<img
				ref={imageRef}
				src={imageUrl}
				alt='preview'
				className='max-w-[900px] h-auto cursor-crosshair'
				draggable='false'
			/>
			{points.map(diff => (
				<div
					key={diff.id}
					className={`absolute border-2 rounded-full pointer-events-none
            ${
							highlightId === diff.id
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
			))}
		</div>
	)
}
