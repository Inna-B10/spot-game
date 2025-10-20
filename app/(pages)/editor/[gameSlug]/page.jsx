import NotFoundPage from '@/app/not-found'
import { Button } from '@/components/ui/buttons/Button'
import { LinkButton } from '@/components/ui/buttons/LinkButton'
import { BLOB_URL } from '@/config/config'
import { getGameBySlug } from '@/services/server/gamesDB.service'
import { getStagesByGameSlug } from '@/services/server/stagesDB.service'
import Image from 'next/image'
import Link from 'next/link'

export default async function GameIndex({ params }) {
	const { gameSlug } = await params

	if (!gameSlug) return NotFoundPage()

	//# ------------------------ Fetch game info (title and description)
	const data = await getGameBySlug(gameSlug)
	const gameDB = data.data

	//# ------------------------ If game not found — return 404
	if (!gameDB) return NotFoundPage()

	//# ------------------------ Fetch all stages for this game
	const { data: stagesByGame } = await getStagesByGameSlug(gameSlug)

	//* -------------------------------- Rendering ------------------------------- */
	return (
		<section className='space-y-8 w-full'>
			{/* //# ------------------------ Game title and navigation */}
			<div className='flex justify-between items-center gap-2'>
				<h1 className='text-xl font-bold'>Category: {gameDB.game_title}</h1>
				<span className='space-x-4'>
					<LinkButton href='/editor' role='button' aria-label='Go to main editor page'>
						Back to Editor
					</LinkButton>
					<LinkButton href='/' role='button' aria-label='Go to homepage'>
						Back to Home
					</LinkButton>
				</span>
			</div>
			{/* //# ------------------------ Game description */}
			<div className='flex gap-4 justify-between items-center'>
				<p>
					<span className='font-semibold'>Description:</span> {gameDB.game_desc || 'No description provided.'}
				</p>
				<Button>Edit desc</Button> {/*//[TODO] implement editing */}
			</div>
			{/* //# ------------------------ Add new stage button */}
			<div className='text-center w-full my-16'>
				<LinkButton href={`/editor/${gameSlug}/new`} role='button' aria-label='Create new stage' style={{ fontSize: '22px' }}>
					Create new stage
				</LinkButton>
			</div>

			{/* //# ------------------------ List of stages */}
			{stagesByGame?.length > 0 ? (
				<>
					<h2 className='text-lg font-semibold inline-block'>Choose stage to edit</h2>
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
