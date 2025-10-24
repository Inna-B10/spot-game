export function ImageWithAreas({ imageUrl, areas, onPointClick, highlightId, imageRef, onMouseDown, onMouseMove, onMouseUp, onContextMenu }) {
	const handleClick = e => {
		if (!imageRef?.current) return
		const rect = imageRef.current.getBoundingClientRect()
		const x = e.clientX - rect.left
		const y = e.clientY - rect.top
		onPointClick({ x, y })
	}

	//* --------------------------------- Render --------------------------------- */
	return (
		<div
			className='relative content-center w-fit'
			onClick={handleClick}
			onMouseDown={onMouseDown}
			onMouseMove={onMouseMove}
			onMouseUp={onMouseUp}
			onContextMenu={onContextMenu}>
			{/* next/image does not support correctly ref */}
			<img ref={imageRef} src={imageUrl} alt='preview' className='max-w-[900px] h-auto cursor-crosshair' draggable='false' />

			{areas.map(area =>
				area.type === 'circle' ? (
					<div
						key={area.id}
						className={`absolute border-2 rounded-full pointer-events-none
            ${highlightId === area.id ? 'border-green-500 animate-ping-small' : 'border-green-600'}`}
						style={{
							left: area.x - area.radius,
							top: area.y - area.radius,
							width: area.radius * 2,
							height: area.radius * 2,
						}}
					/>
				) : (
					<div
						key={area.id}
						className={`absolute border-2 pointer-events-none ${highlightId === area.id ? 'border-green-500 animate-ping-tiny' : 'border-green-600'}`}
						style={{
							left: `${area.x}px`,
							top: `${area.y}px`,
							width: `${area.width}px`,
							height: `${area.height}px`,
						}}
					/>
				)
			)}
		</div>
	)
}
