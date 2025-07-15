import { useSaveGame } from '@/hooks/useSaveGame'
import { Button } from './ui/buttons/Button'

export function EditorToolbar({
	radius,
	setRadius,
	points,
	game,
	mode,
	setModified,
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
		points,
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

			<div className='flex justify-center items-center'>
				{game === 'find-pair'
					? points?.length % 2 > 0
						? `${(points?.length - 1) / 2} pairs + 1 point`
						: `${points?.length / 2} pairs`
					: `${points?.length} points`}
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
