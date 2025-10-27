import { Button } from '@/components/ui/buttons/Button'
import { DIFFICULTY_OPTIONS } from '@/constants/difficulty'
import { useSaveStage } from '@/hooks/useSaveStage'
import { sanitizeDesc } from '@/lib/utils/sanitizeInput'

export function EditorToolbar({
	drawMode,
	setDrawMode,
	radius,
	setRadius,
	gameSlug,
	mode,
	modified,
	setModified,
	imageFile,
	stage,
	task,
	setTask,
	difficulty,
	setDifficulty,
	resetStage,
}) {
	//# -- Custom Hook Handles Saving Logic (Blob Upload + Prisma Update/insert)
	const { saveStage, isPending } = useSaveStage(gameSlug, mode, imageFile, setModified, stage)

	//# -------------------------------- Handlers
	const handleDescChange = e => {
		if (task !== e.target.value) {
			setTask(e.target.value)
			setModified(true)
		}
	}

	const handleDiffChange = e => {
		if (difficulty !== e.target.value) {
			setDifficulty(e.target.value)
			setModified(true)
		}
	}

	const deleteStage = () => {}
	//* ----------------------------- Render ----------------------------- */
	return (
		<div className='w-full flex flex-col gap-8'>
			<ul className='p-4 bg-blue-300 rounded'>
				<h2 className='font-bold text-xl mb-2'>Drawing Click Areas:</h2>
				<li>🔹 Delete: Right click inside an area</li>
				<li>🔹 Circle: left click (the click point is the circle center)</li>
				<li>🔹 Rectangle: click and drag to draw</li>
				<li>🔹 Areas should not overlap or should have only minimal shared space</li>
			</ul>
			{/* //# ------------------------ Save + Delete buttons */}
			<div className='flex justify-center gap-4'>
				<Button onClick={saveStage} variant='primary' aria-label='Save stage' disabled={!modified || isPending}>
					Save
				</Button>
				<Button onClick={resetStage} variant='warn' aria-label='Reset stage' disabled={isPending || mode === 'create' || !modified}>
					Undo changes
				</Button>
				<Button onClick={deleteStage} variant='warn' aria-label='Delete stage' disabled={isPending || mode === 'create'}>
					Delete
				</Button>
			</div>
			{/* //# ------------------------ Desc + difficulty */}
			<div className='w-full flex justify-between gap-8'>
				<div className='w-5/12 flex flex-col gap-4 justify-between p-4 bg-blue-300 rounded'>
					<label htmlFor='stageTask'>
						<h2 className='font-bold text-xl'>Stage task:</h2>
					</label>
					<p>
						<span className='text-red-500 font-bold'>Optional!</span> <br />
						Add it only if the level's idea differs from the main game category or stage needs more specific instructions.
					</p>
					<textarea
						id='stageTask'
						value={sanitizeDesc(task)}
						onChange={handleDescChange}
						placeholder='Write short instruction...'
						disabled={isPending}
						rows={2}
						className='w-full'
					/>
				</div>
				<div className='w-7/12 flex flex-col gap-4 justify-between p-4 bg-blue-300 rounded'>
					<label htmlFor='stageDifficulty'>
						<h2 className='font-bold text-xl'>Difficulty:</h2>
					</label>
					<p>
						These are approximate guidelines, not strict rules. Always consider how hard the stage actually is — assign difficulty based on your own judgment rather than
						following the table exactly.
					</p>
					<div className='w-full flex gap-4 justify-between'>
						<ul>
							<li>Easy: 1-5 differences/areas</li>
							<li>Medium: 6-10 differences/areas</li>
							<li>Hard: 11 or more differences/areas</li>
						</ul>
						<select id='stageDifficulty' value={difficulty} className='w-fit p-2 h-fit' required onChange={handleDiffChange}>
							<option value='' disabled hidden>
								Select difficulty
							</option>
							{DIFFICULTY_OPTIONS.map(opt => (
								<option key={opt.value} value={opt.value}>
									{opt.label}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>
			<div className='w-full flex gap-4 justify-between items-center rounded bg-blue-300 p-4'>
				{/* //# ------------------------ Info about number of created areas */}
				<div className='flex flex-col justify-center'>
					<span className='text-center'>Created:</span>
					<div>
						{gameSlug === 'find-pair'
							? stage.areas?.length % 2 > 0
								? `${(stage.areas?.length - 1) / 2} pairs + 1 point`
								: `${stage.areas?.length / 2} pairs`
							: `${stage.areas?.length} areas`}
					</div>
				</div>

				{/* //# ------------------------ Radius control for drawing shapes */}
				<div className='flex flex-col justify-center'>
					<label htmlFor='radius' className='text-center'>
						Radius:
					</label>
					<input type='number' id='radius' value={radius} onChange={e => setRadius(Number(e.target.value))} className='w-15 text-right' />
				</div>

				{/* //# ------------------------ Toggle between circle and rectangle drawing modes */}
				<div className='flex flex-col justify-center'>
					<span className='text-center'>Drawing mode:</span>
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
				</div>
			</div>
		</div>
	)
}
