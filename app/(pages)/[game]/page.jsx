import { LinkButton } from '@/components/ui/buttons/LinkButton'
import { BLOB_URL } from '@/config/config'
import { getLevelsByGameSlug } from '@/services/server/levels'
import Image from 'next/image'
import Link from 'next/link'

export const revalidate = 86400

//* ---------------------------- Generate Metadata --------------------------- */
export async function generateMetadata({ params }) {
	const { game } = await params

	if (!game) return {}

	const dbGame = await prisma.games.findFirst({
		where: { game_slug: game },
	})

	if (!dbGame) {
		return {
			title: 'Game not found',
			description: 'This game does not exist',
		}
	}

	return {
		title: `Levels of ${dbGame.game_title}`,
		description: dbGame.game_desc || `List of levels for ${dbGame.game_title}`,
	}
}

//* -------------------------- Generate StaticParams ------------------------- */
export async function generateStaticParams() {
	const games = await prisma.games.findMany({
		select: { game_slug: true },
	})

	return games.map(game => ({ game: game.game_slug }))
}

//* ---------------------------------- Page ---------------------------------- */
export default async function GamePage({ params }) {
	const { game } = await params

	if (!game) return notFound()

	const gameDB = await prisma.games.findFirst({
		where: { game_slug: game },
		select: { game_title: true, game_desc: true },
	})

	const levelsByGame = await getLevelsByGameSlug(game)

	if (!levelsByGame || levelsByGame.length === 0) {
		return (
			<>
				<p>There are no levels</p>
				<LinkButton href='/' role='button' aria-label='Go to main page'>
					Back to Home
				</LinkButton>
			</>
		)
	}

	//* -------------------------------- Rendering ------------------------------- */
	return (
		<section key={game} className='space-y-8 w-full'>
			<div className='flex justify-between items-center gap-2'>
				<h2 className='text-xl font-semibold'> {gameDB.game_title}</h2>
				<LinkButton href='/' role='button' aria-label='Go to homepage'>
					Home
				</LinkButton>
			</div>
			<p className='text-left'>{gameDB.game_desc}</p>

			{/* //# ------------------------ List of levels */}
			<ul className='flex flex-wrap gap-4'>
				{levelsByGame?.map(level => (
					<li key={level.level_id} className='border p-4 rounded shadow hover:shadow-md'>
						<Link href={`/${game}/${level.level_slug}`} title={`open ${level.level_slug}`}>
							{level.level_slug}
							<Image src={`${BLOB_URL}${level.image_path}`} alt={level.level_slug} width={100} height={100} className='w-fit h-fit object-contain' />
						</Link>
					</li>
				))}
			</ul>
		</section>
	)
}
