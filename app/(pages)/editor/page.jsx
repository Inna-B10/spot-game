import { LinkButton } from '@/components/ui/buttons/LinkButton'
import { NO_INDEX_PAGE } from '@/constants/seo.constants'
import { prisma } from '@/lib/prisma/client'

export const metadata = {
	title: 'Editor | Home',
	...NO_INDEX_PAGE,
}

//* ------------------------------- Editor Page ------------------------------ */
export default async function EditorPage() {
	//# ------------------------ Fetch all games from DB
	const games = await prisma.games.findMany({
		select: {
			game_id: true,
			game_title: true,
			game_slug: true,
			game_desc: true,
		},
		orderBy: { game_id: 'asc' },
	})

	if (games.length === 0) {
		return (
			<div className='text-center'>
				<p className='text-gray-500'>No games found in the database.</p>
				<LinkButton href='/' role='button' aria-label='Go to homepage'>
					Back to Home
				</LinkButton>
			</div>
		)
	}

	return (
		<>
			<div className='flex justify-between items-center gap-2 mb-4'>
				<h1 className='text-2xl font-semibold'>Choose game</h1>
				<LinkButton href='/' role='button' aria-label='Go to homepage'>
					Back to Home
				</LinkButton>
			</div>

			{/* //# ------------------------ List of available games */}
			<ul className='inline-flex gap-2'>
				{games.map(({ game_slug, game_title }) => (
					<li key={game_slug}>
						<LinkButton href={`/editor/${game_slug}`} role='button' aria-label={`Go to ${game_title} editor`}>
							{game_title}
						</LinkButton>
					</li>
				))}
			</ul>
		</>
	)
}
