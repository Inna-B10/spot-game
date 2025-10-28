import NotFoundPage from '@/app/not-found'
import PlayGame from '@/components/PlayGame'
import { LinkButton } from '@/components/ui/buttons/LinkButton'
import { BLOB_URL } from '@/config/config'
import { dbGetGameBySlug } from '@/services/server/gamesServer.service'
import { dbGetAllStages, dbGetNextStage, dbGetStageByStageSlug } from '@/services/server/stagesServer.service'
import cn from 'clsx'

export const revalidate = 86400 //1 day

//* ---------------------------- Generate Metadata --------------------------- */
export async function generateMetadata({ params }) {
	const { gameSlug, stageSlug } = await params
	if (!stageSlug || !gameSlug) return {}

	const { data: dbGame } = await dbGetGameBySlug(gameSlug)

	if (!dbGame) return {}

	return {
		title: `Game ${dbGame.game_title} | Stage ${stageSlug}`,
		description: `${dbGame.game_desc || 'Open the stage'} | Stage ${stageSlug}`,
	}
}

//* -------------------------- Generate StaticParams ------------------------- */
export async function generateStaticParams() {
	const { success, data: stages } = await dbGetAllStages()
	if (!success) return []

	return stages.map(({ stage_slug, games }) => ({
		gameSlug: games.game_slug,
		stageSlug: stage_slug,
	}))
}

//* ---------------------------------- Page ---------------------------------- */
export default async function PlayFindPage({ params }) {
	const { gameSlug, stageSlug } = await params
	if (!stageSlug || !gameSlug) return NotFoundPage()

	//# ------------------------ Find current stage
	const { data: stage } = await dbGetStageByStageSlug(stageSlug, gameSlug)
	if (!stage) return NotFoundPage()

	//# ------------------------ Next stage
	const { data: nextStage } = await dbGetNextStage(stage.game_id, stage.stage_id)

	//* --------------------------------- Render --------------------------------- */
	return (
		<>
			{/* //# ------------------------ Menu */}
			<div className='flex justify-center items-center gap-4 mb-10'>
				<LinkButton href='/' role='button' aria-label='Go to homepage'>
					Choose another game
				</LinkButton>
				<LinkButton href={`/${gameSlug}`} role='button' aria-label='Go to game index'>
					Choose another stage
				</LinkButton>
			</div>

			{/* //# ------------------------ Game, stage info */}
			<div className={cn('flex flex-col justify-between items-center gap-2 mb-6 lg:flex-row bg-bg rounded', nextStage ? 'p-2' : 'py-4 px-2')}>
				<div className='flex gap-8 justify-center'>
					<p>
						<span className='font-semibold text-blue-500 mr-1'>Game:</span>
						{stage.games.game_title}
					</p>
					<p>
						<span className='font-semibold text-blue-500 mr-1'>Stage:</span>
						{stage.stage_slug}
					</p>
					<div>
						<span className='font-semibold text-blue-500 mr-1'>Difficulty:</span>
						{stage.difficulty}
					</div>
				</div>
				{/* //# ------------------------ Next stage button */}
				<div className='min-w-16 mt-2 lg:mt-0'>
					{nextStage && (
						<LinkButton href={`/${gameSlug}/${nextStage.stage_slug}`} role='button' aria-label='Go to next stage'>
							Next
						</LinkButton>
					)}
				</div>
			</div>
			<div className='w-full'>
				<span className='font-semibold text-blue-500 mr-1'>Stage task:</span>
				{stage.stage_task ? stage.stage_task : stage.games.game_desc}
			</div>
			<PlayGame stage={{ ...stage, image_path: `${BLOB_URL}${stage.image_path}` }} gameSlug={gameSlug} />
		</>
	)
}
