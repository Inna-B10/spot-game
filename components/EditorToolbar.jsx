import { GAMES } from '@/constants/games'
import { useSaveGame } from '@/hooks/useSaveGame'

export function EditorToolbar({
	radius,
	setRadius,
	points,
	game,
	mode,
	setModified,
	id,
	imageUrl,
}) {
	return (
		<div className='w-full flex gap-4 justify-between'>
			<label className='flex flex-col lg:flex-row lg:items-center gap-2'>
				Radius:
				<input
					type='number'
					value={radius}
					onChange={e => setRadius(e.target.value)}
					className='border p-1 w-15 text-right'
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
					{GAMES.map(g => (
						<button
							key={g.game}
							onClick={() =>
								useSaveGame(
									g.game,
									mode,
									id,
									imageUrl,
									points,
									setModified,
									game
								)
							}
							className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
							Save to {g.label}
						</button>
					))}
				</div>
			) : (
				<button
					onClick={() =>
						useSaveGame(game, mode, id, imageUrl, points, setModified, game)
					}
					className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
					Save
				</button>
			)}
		</div>
	)
}
