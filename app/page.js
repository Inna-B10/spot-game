import { LinkButton } from '@/components/ui/buttons/LinkButton'
import { getGames } from '@/services/server/games'

export default async function Home() {
	const games = await getGames()

	return (
		<div className='space-y-6'>
			<h1 className='text-2xl font-bold'>🏠 Home</h1>
			<ul className='mb-8'>
				<li>
					<LinkButton href='/editor' role='button' aria-label='Go to editor main page'>
						🎨 Editor
					</LinkButton>
				</li>
			</ul>
			<h2 className='text-xl font-bold'>🎮 Choose game</h2>

			{/* //# ------------------------ List of games */}
			<ul className='inline-flex gap-2'>
				{games.map(({ game_id, game_title, game_slug }) => (
					<li key={game_id}>
						<LinkButton href={`/${game_slug}`} role='button' aria-label={`Go to ${game_title} games list`}>
							{game_title}
						</LinkButton>
					</li>
				))}
			</ul>
		</div>
	)
}
