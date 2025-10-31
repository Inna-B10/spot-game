import { LinkButton } from '@/components/ui/buttons/LinkButton'
import { dbGetAllGames } from '@/services/server/gamesServer.service'
import cn from 'clsx'
import { Dices, House, LayoutDashboard } from 'lucide-react'

export const revalidate = 86400 //1 day

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
			<h1 className='inline-flex text-2xl font-bold'>
				<House className='mr-2' size={28} /> Home
			</h1>
			<ul className='mb-8'>
				<li>
					<LinkButton href='/editor' role='button' aria-label='Go to editor main page'>
						<h2 className='inline-flex font-semibold text-xl align-bottom'>
							<LayoutDashboard className='mr-2' />
							Editor
						</h2>
					</LinkButton>
				</li>
			</ul>
			<h2 className='inline-flex text-xl font-bold mb-2'>
				<Dices className='mr-2' />
				Choose game
			</h2>

			{/* //# ------------------------ List of games */}
			{data && data?.length > 0 ? (
				<div className='flex flex-wrap gap-2'>
					{data.map(({ game_id, game_title, game_slug }) => (
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
