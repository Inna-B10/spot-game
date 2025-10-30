import { LinkButton } from '@/components/ui/buttons/LinkButton'
import { dbGetAllGames } from '@/services/server/gamesServer.service'
import cn from 'clsx'

// Use 86400 for development to test ISR/build-time snapshot
// Use false in production to avoid build errors and use runtime fetch with tags

export const revalidate = process.env.NODE_ENV === 'development' ? 86400 : false

export default async function Home() {
	let payload
	let ok

	if (process.env.NODE_ENV === 'development') {
		// Dev: fetch data directly from server service
		const { success, data } = await dbGetAllGames()
		payload = data
		ok = success
	} else {
		// Prod: fetch data via API with tags for runtime cache revalidation
		const res = await fetch('/api/games/game-get-all', {
			next: { tags: ['games-list'] },
		})
		const { success, data } = await res.json()
		payload = data
		ok = success
	}

	let msg = ''
	if (!ok) {
		msg = 'DB Error: Failed to load games.'
	} else if (payload?.length === 0) {
		msg = 'No games found.'
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
			<h2 className='text-xl font-bold mb-2'>🎮 Choose game</h2>

			{/* //# ------------------------ List of games */}
			{payload && payload?.length > 0 ? (
				<div className='flex flex-wrap gap-2'>
					{payload.map(({ game_id, game_title, game_slug }) => (
						<LinkButton key={game_id} href={`/${game_slug}`} role='button' aria-label={`Go to ${game_title} index`}>
							{game_title}
						</LinkButton>
					))}
				</div>
			) : (
				<div className={cn(!success && 'text-red-500')}>{msg}</div>
			)}
		</div>
	)
}
