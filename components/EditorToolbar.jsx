import { useSaveGame } from '@/hooks/useSaveGame'
import { Button } from './ui/buttons/Button'

export function EditorToolbar({
	radius,
	setRadius,
	areas,
	game,
	mode,
	setModified,
	setDrawMode,
	drawMode,
	id,
	imageUrl,
	imageFile,
}) {
	const saveGame = useSaveGame(
		game,
		mode,
		id,
		imageUrl,
		imageFile,
		areas,
		setModified
	)
	return (
		<div className='w-full flex gap-4 justify-between'>
			<label className='flex flex-col lg:flex-row lg:items-center gap-2'>
				Radius:
				<input
					type='number'
					value={radius}
					onChange={e => setRadius(e.target.value)}
					className='border p-1 w-15 text-right rounded'
				/>
			</label>
			<span>
				Режим: &nbsp;
				<div className='flex items-center space-x-2'>
					<span>Круг</span>
					<button
						onClick={() =>
							setDrawMode(drawMode === 'circle' ? 'rect' : 'circle')
						}
						className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
							drawMode === 'rect'
								? 'bg-blue-600 justify-end'
								: 'bg-green-600 justify-start'
						}`}>
						<div className='w-4 h-4 bg-white rounded-full shadow-md' />
					</button>
					<span>Прямоугольник</span>
				</div>
			</span>
			<div className='flex justify-center items-center'>
				{game === 'find-pair'
					? areas?.length % 2 > 0
						? `${(areas?.length - 1) / 2} pairs + 1 point`
						: `${areas?.length / 2} pairs`
					: `${areas?.length} areas`}
			</div>
			{mode === 'create' ? (
				<div className='flex gap-2 items-center'>
					<Button onClick={saveGame} aria-label='Save level' variant='primary'>
						Save level
					</Button>
				</div>
			) : (
				<Button onClick={saveGame} variant='primary' aria-label='Save level'>
					Save level
				</Button>
			)}
		</div>
	)
}
