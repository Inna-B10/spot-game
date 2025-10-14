import PlayGame from '@/components/PlayGame'
import { LinkButton } from '@/components/ui/buttons/LinkButton'
import { BLOB_URL } from '@/config/config'
import { prisma } from '@/lib/prisma/client'
import clsx from 'clsx'
import { notFound } from 'next/navigation'

export const revalidate = 86400

//* ---------------------------- Generate Metadata --------------------------- */
export async function generateMetadata({ params }) {
	const { game, id } = await params
	if (!id || !game) return {}

	const dbGame = await prisma.games.findFirst({
		where: { game_slug: game },
		select: { game_title: true, game_desc: true },
	})

	if (!dbGame) return {}

	return {
		title: `Game ${dbGame.game_title} | Level ${id}`,
		description: `${dbGame.game_desc || 'Play the level'} | Level ${id}`,
	}
}

//* -------------------------- Generate StaticParams ------------------------- */
export async function generateStaticParams() {
	const levels = await prisma.levels.findMany({
		select: {
			level_slug: true,
			games: {
				select: { game_slug: true },
			},
		},
	})

	return levels.map(({ level_slug, games }) => ({
		game: games.game_slug,
		id: level_slug,
	}))
}

//* ---------------------------------- Page ---------------------------------- */
export default async function PlayFindPage({ params }) {
	const { game, id } = await params
	if (!id || !game) return notFound()

	//# ------------------------ Find current level
	const level = await prisma.levels.findFirst({
		where: {
			level_slug: id,
			games: { game_slug: game },
		},
		include: {
			games: true, // to get game_title, game_desc
		},
	})
	if (!level) return notFound()

	//# ------------------------ Next level
	const nextLevel = await prisma.levels.findFirst({
		where: {
			game_id: level.game_id,
			level_id: { gt: level.level_id },
		},
		orderBy: { level_id: 'asc' },
		select: { level_slug: true },
	})

	//* -------------------------------- Rendering ------------------------------- */
	return (
		<>
			{/* //# ------------------------ Menu */}
			<div className='flex justify-center items-center gap-4 mb-10'>
				<LinkButton href='/' role='button' aria-label='Go to homepage'>
					Choose another game
				</LinkButton>
				<LinkButton href={`/${game}`} role='button' aria-label='Go to game levels'>
					Choose another level
				</LinkButton>
			</div>

			{/* //# ------------------------ Game, level info */}
			<div className={clsx('flex flex-col justify-between items-center gap-2 mb-6 lg:flex-row bg-bg rounded', nextLevel ? 'p-2' : 'py-4 px-2')}>
				<div className='flex gap-8 justify-center'>
					<p>
						<span className='font-semibold text-blue-500'>Game:</span> {level.games.game_title}
					</p>
					<p>
						<span className='font-semibold text-blue-500'>Level:</span> {level.level_slug}
					</p>
				</div>
				<div>
					<span className='font-semibold text-blue-500'>Description:</span> {level.games.game_desc}
				</div>
				{/* //# ------------------------ Next level button */}
				<div className='min-w-16 mt-2 lg:mt-0'>
					{nextLevel && (
						<LinkButton href={`/${game}/${nextLevel.level_slug}`} role='button' aria-label='Go to next level'>
							Next
						</LinkButton>
					)}
				</div>
			</div>
			<PlayGame level={{ ...level, image_path: `${BLOB_URL}${level.image_path}` }} game={game} />
		</>
	)
}
