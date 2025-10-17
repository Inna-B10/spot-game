import NotFoundPage from '@/app/not-found'
import { LinkButton } from '@/components/ui/buttons/LinkButton'
import { BLOB_URL } from '@/config/config'
import { prisma } from '@/lib/prisma/client'
import { getStagesByGameSlug } from '@/services/server/stages'
import Image from 'next/image'
import Link from 'next/link'

export const revalidate = 86400

//* ---------------------------- Generate Metadata --------------------------- */
export async function generateMetadata({ params }) {
	const { gameSlug } = await params

	if (!gameSlug) return {}

	const dbGame = await prisma.games.findFirst({
		where: { game_slug: gameSlug },
	})

	if (!dbGame) {
		return {
			title: 'Game not found',
			description: 'This game does not exist',
		}
	}

	return {
		title: `Stages of ${dbGame.game_title}`,
		description: dbGame.game_desc || `List of stages for ${dbGame.game_title}`,
	}
}

//* -------------------------- Generate StaticParams ------------------------- */
export async function generateStaticParams() {
	const games = await prisma.games.findMany({
		select: { game_slug: true },
	})

	return games.map(game => ({ gameSlug: game.game_slug }))
}

//* ---------------------------------- Page ---------------------------------- */
export default async function GamePage({ params }) {
	const { gameSlug } = await params

	if (!gameSlug) return NotFoundPage()

	const gameDB = await prisma.games.findFirst({
		where: { game_slug: gameSlug },
		select: { game_title: true, game_desc: true },
	})

	const stagesByGame = await getStagesByGameSlug(gameSlug)

	if (!stagesByGame || stagesByGame.length === 0) {
		return (
			<>
				<p>There are no stages</p>
				<LinkButton href='/' role='button' aria-label='Go to main page'>
					Back to Home
				</LinkButton>
			</>
		)
	}

	//* -------------------------------- Rendering ------------------------------- */
	return (
		<section className='space-y-8 w-full'>
			<div className='flex justify-between items-center gap-2'>
				<h2 className='text-xl font-semibold'> {gameDB.game_title}</h2>
				<LinkButton href='/' role='button' aria-label='Go to homepage'>
					Home
				</LinkButton>
			</div>
			<p>{gameDB.game_desc}</p>

			{/* //# ------------------------ List of stages */}
			<ul className='flex flex-wrap gap-4'>
				{stagesByGame?.map(stage => (
					<li key={stage.stage_id} className='border p-4 rounded shadow hover:shadow-md'>
						<Link href={`/${gameSlug}/${stage.stage_slug}`} title={`open ${stage.stage_slug}`}>
							{stage.stage_slug}
							<Image src={`${BLOB_URL}${stage.image_path}`} alt={stage.stage_slug} width={100} height={100} className='w-fit h-fit object-contain' />
						</Link>
					</li>
				))}
			</ul>
		</section>
	)
}
