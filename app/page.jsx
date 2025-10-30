import { LinkButton } from '@/components/ui/buttons/LinkButton'
import { REVALIDATE_INTERVAL } from '@/config/config'
import { dbGetAllGames } from '@/services/server/gamesServer.service'
import cn from 'clsx'

export const revalidate = false

export default async function Home() {
	let payload, ok

	if (process.env.NODE_ENV === 'development') {
		// Dev: fetch data directly from server service
		const { success, data } = await dbGetAllGames()
		payload = data
		ok = success
	} else {
		// Prod: fetch data via API with tags for manual cache revalidation
		const res = await fetch('/api/games/game-get-all', {
			next: { tags: ['games-list'] },
			revalidate: REVALIDATE_INTERVAL,
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
