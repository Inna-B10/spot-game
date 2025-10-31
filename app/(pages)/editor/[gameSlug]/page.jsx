import NotFoundPage from '@/app/not-found'
import { DeleteGameButtonDyn } from '@/components/editor/deleteGameButton/DeleteGameButtonDyn'
import { GameDetailsDyn } from '@/components/editor/gameDetails/GameDetailsDyn'
import { LinkButton } from '@/components/ui/buttons/LinkButton'
import { BLOB_URL } from '@/config/config'
import { NO_INDEX_PAGE } from '@/constants/seo.constants'
import { dbGetGameBySlug } from '@/services/server/gamesServer.service'
import { dbGetStagesByGameSlug } from '@/services/server/stagesServer.service'
import Image from 'next/image'
import Link from 'next/link'

export async function generateMetadata({ params }) {
	const { gameSlug } = await params
	return {
		title: `Editor | ${gameSlug}`,
		...NO_INDEX_PAGE,
	}
}

export default async function GameIndex({ params }) {
	const { gameSlug } = await params
	if (!gameSlug) return NotFoundPage()

	const { data: gameDB } = await dbGetGameBySlug(gameSlug) // Fetch game info (title and description)
	if (!gameDB) return NotFoundPage() // If game not found — return 404

	const { data: stagesByGame } = await dbGetStagesByGameSlug(gameSlug) // Fetch all stages for this game

	//* --------------------------------- Render --------------------------------- */
	return (
		<section className='space-y-8 w-full'>
			{/* //# ------------------------ Navigation */}
			<span className='space-x-4'>
				<LinkButton href='/editor' role='button' aria-label='Go to main editor page'>
					Editor
				</LinkButton>
				<LinkButton href='/' role='button' aria-label='Go to homepage'>
					Home
				</LinkButton>
			</span>

			{/* //# ------------------------ Edit/Delete game */}
			<div className='flex justify-between items-top gap-2'>
				<GameDetailsDyn initialGame={gameDB} />
				<DeleteGameButtonDyn gameSlug={gameSlug} />
			</div>
			{/* //# ------------------------ Add new stage button */}
			<div className='text-center w-full my-20'>
				<LinkButton href={`/editor/${gameSlug}/new`} role='button' aria-label='Create new stage' style={{ fontSize: '22px' }}>
					Create new stage
				</LinkButton>
			</div>

			{/* //# ------------------------ List of stages */}
			{stagesByGame?.length > 0 ? (
				<>
					<h2 className='text-lg font-semibold inline-block mb-2'>Choose stage to edit</h2>
					<ul className='flex flex-wrap gap-4'>
						{stagesByGame.map(stage => (
							<li key={stage.stage_id} className='border p-4 rounded shadow hover:shadow-md'>
								<Link href={`/editor/${gameSlug}/${stage.stage_slug}`} title={`open ${stage.stage_slug} to edit`}>
									{stage.stage_slug}
									{/* //# ------------------------ Show preview image from Blob storage */}
									<Image src={`${BLOB_URL}${stage.image_path}`} alt={stage.stage_slug} width={100} height={100} className='w-fit h-fit object-contain' />
								</Link>
							</li>
						))}
					</ul>
				</>
			) : (
				<p>There are no stages for this game yet.</p>
			)}
		</section>
	)
}
