import { useSaveGame } from '@/hooks/useSaveGame'
import { Button } from './ui/buttons/Button'

export function EditorToolbar({ radius, setRadius, areas, game, mode, setModified, setDrawMode, drawMode, id, imageUrl, imageFile, modified }) {
	const saveGame = useSaveGame(game, mode, id, imageUrl, imageFile, areas, setModified)

	return (
		<div className='w-full flex gap-4 justify-between items-center rounded bg-blue-300 p-4 my-4'>
			<div className='flex items-center w-1/4'>
				Created:&nbsp;
				{game === 'find-pair' ? (areas?.length % 2 > 0 ? `${(areas?.length - 1) / 2} pairs + 1 point` : `${areas?.length / 2} pairs`) : `${areas?.length} areas`}
			</div>
			<label className='flex flex-col lg:flex-row lg:items-center gap-2'>
				Radius:
				<input type='number' value={radius} onChange={e => setRadius(e.target.value)} className='border p-1 w-15 text-right rounded' />
			</label>
			<span>
				Drawing mode: &nbsp;
				<div className='flex items-center space-x-2'>
					<span>circle</span>
					<button
						onClick={() => setDrawMode(drawMode === 'circle' ? 'rect' : 'circle')}
						className={`w-12 h-6 flex items-center rounded-full p-1 shadow-sm transition-colors ${
							drawMode === 'rect' ? 'bg-blue-600 justify-end' : 'bg-green-600 justify-start'
						}`}>
						<div className='w-4 h-4 bg-white rounded-full' />
					</button>
					<span>rectangle</span>
				</div>
			</span>

			<Button onClick={saveGame} variant='primary' aria-label='Save level' disabled={!modified}>
				Save level
			</Button>
		</div>
	)
}
