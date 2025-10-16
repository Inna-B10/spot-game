import NotFoundPage from '@/app/not-found'
import { LinkButton } from '@/components/ui/buttons/LinkButton'
import { BLOB_URL } from '@/config/config'
import { prisma } from '@/lib/prisma/client'
import { getStagesByGameSlug } from '@/services/server/stages'
import Image from 'next/image'
import Link from 'next/link'

export default async function GameIndex({ params }) {
	const { gameSlag } = await params

	if (!gameSlag) return NotFoundPage()

	//# ------------------------ Fetch game info (title and description)
	const gameDB = await prisma.games.findFirst({
		where: { game_slug: gameSlag },
		select: { game_title: true, game_desc: true },
	})

	//# ------------------------ If game not found — return 404
	if (!gameDB) return NotFoundPage()

	//# ------------------------ Fetch all stages for this game
	const stagesByGame = await getStagesByGameSlug(gameSlag)

	if (!stagesByGame || stagesByGame.length === 0) {
		return (
			<div className='flex flex-col items-center gap-8'>
				<p>There are no stages for this game yet.</p>
				<LinkButton href='/' role='button' aria-label='Go to main page'>
					Back to Home
				</LinkButton>
			</div>
		)
	}

	//* -------------------------------- Rendering ------------------------------- */
	return (
		<section className='space-y-8 w-full'>
			{/* //# ------------------------ Game title and navigation */}
			<div className='flex justify-between items-center gap-2'>
				<h1 className='text-xl font-bold'>Game: {gameDB.game_title}</h1>
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
			<p className='text-left'>
				<span className='font-semibold'>Description:</span> {gameDB.game_desc || 'No description provided.'}
			</p>
			{/* //# ------------------------ Add new stage button */}
			<h2 className='text-lg font-semibold inline-block'>Choose stage</h2>
			&nbsp; &nbsp;or&nbsp;&nbsp;&nbsp;
			<LinkButton href={`/editor/${gameSlag}/new`} className='inline-block text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded h-fit w-fit'>
				Create a new
			</LinkButton>
			{/* //# ------------------------ List of stages */}
			<ul className='flex flex-wrap gap-4'>
				{stagesByGame?.map(stage => (
					<li key={stage.stage_id} className='border p-4 rounded shadow hover:shadow-md'>
						<Link href={`/editor/${gameSlag}/${stage.stage_slug}`} title={`open ${stage.stage_slug} to edit`}>
							{stage.stage_slug}
							{/* //# ------------------------ Show preview image from Blob storage */}
							<Image src={`${BLOB_URL}${stage.image_path}`} alt={stage.stage_slug} width={100} height={100} className='w-fit h-fit object-contain' />
						</Link>
					</li>
				))}
			</ul>
		</section>
	)
}
