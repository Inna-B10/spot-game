import { Button } from '@/components/ui/buttons/Button'
import { useSaveGame } from '@/hooks/useSaveGame'

export function EditorToolbar({ drawMode, setDrawMode, radius, setRadius, gameSlug, mode, modified, setModified, imageFile, level }) {
	//* -- Custom Hook Handles Saving Logic (Blob Upload + Prisma Update/insert) - */
	const saveGame = useSaveGame(gameSlug, mode, imageFile, setModified, level)

	//* ----------------------------- Render ----------------------------- */
	return (
		<div className='w-full flex gap-4 justify-between items-center rounded bg-blue-300 p-4 my-4'>
			{/* //# ------------------------ Info about number of created areas */}
			<div className='flex items-center w-1/4'>
				Created:&nbsp;
				{gameSlug === 'find-pair'
					? level.areas?.length % 2 > 0
						? `${(level.areas?.length - 1) / 2} pairs + 1 point`
						: `${level.areas?.length / 2} pairs`
					: `${level.areas?.length} areas`}
			</div>

			{/* //# ------------------------ Radius control for drawing shapes */}
			<label className='flex flex-col lg:flex-row lg:items-center gap-2'>
				Radius:
				<input type='number' value={radius} onChange={e => setRadius(Number(e.target.value))} className='border p-1 w-15 text-right rounded' />
			</label>

			{/* //# ------------------------ Toggle between circle and rectangle drawing modes */}
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

			{/* //# ------------------------ Save button (disabled until modifications occur) */}
			<Button onClick={saveGame} variant='primary' aria-label='Save level' disabled={!modified}>
				Save level
			</Button>
		</div>
	)
}
