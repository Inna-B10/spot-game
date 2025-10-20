import { LinkButton } from '@/components/ui/buttons/LinkButton'
import { dbGetAllGames } from '@/services/server/gamesServer.service'
import cn from 'clsx'

export default async function Home() {
	const { success, data } = await dbGetAllGames()
	let msg = ''
	if (!success) {
		msg = 'DB Error: Failed to fetch games from the database.'
	} else if (data?.length === 0) {
		msg = 'No games found. Try adding a new one!'
	}

	//* --------------------------------- Render --------------------------------- */
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
			{data && data?.length > 0 ? (
				<ul className='inline-flex gap-2'>
					{data.map(({ game_id, game_title, game_slug }) => (
						<li key={game_id}>
							<LinkButton href={`/${game_slug}`} role='button' aria-label={`Go to ${game_title} index`}>
								{game_title}
							</LinkButton>
						</li>
					))}
				</ul>
			) : (
				<div className={cn(!success && 'text-red-500')}>{msg}</div>
			)}
		</div>
	)
}
