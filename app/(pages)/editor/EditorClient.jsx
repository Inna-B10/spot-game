'use client'

import { LinkButton } from '@/components/ui/buttons/LinkButton'
import { apiGetAllGames } from '@/services/client/gamesClient.service'
import { useQuery } from '@tanstack/react-query'
import { NewCategory } from './NewCategory'

export function EditorClient({ initialGames }) {
	//# --------------------------------- fetch all games
	const {
		data: games,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ['get-all-games'],
		queryFn: apiGetAllGames,
		initialData: initialGames,
	})

	if (isLoading) return <div>Loading...</div>

	//# --------------------------------- if error fetching
	if (isError)
		return (
			<>
				<div className='flex justify-between items-center gap-2'>
					<h1 className='text-3xl font-semibold'>Editor</h1>
					<LinkButton href='/' role='button' aria-label='Go to homepage'>
						Back to Home
					</LinkButton>
				</div>
				<p className='text-center mt-[20%] text-red-500'>DB Error: Failed to fetch games from the database</p>
			</>
		)

	//* --------------------------------- Render --------------------------------- */
	return (
		<div className='space-y-10'>
			<div className='flex justify-between items-center gap-2'>
				<h1 className='text-3xl font-semibold'>Editor</h1>
				<LinkButton href='/' role='button' aria-label='Go to homepage'>
					Back to Home
				</LinkButton>
			</div>
			{/* //# ------------------------ List of available games */}
			<div>
				<h2 className='text-2xl font-semibold  mb-2'>Choose category</h2>
				<div className='flex flex-wrap gap-2'>
					{games?.length > 0 ? (
						games.map(({ game_slug, game_title }) => (
							<LinkButton key={game_slug} href={`/editor/${game_slug}`} role='button' aria-label={`Go to ${game_title} editor`}>
								{game_title}
							</LinkButton>
						))
					) : (
						<p className='text-gray-500 text-center'>No games found in the database.</p>
					)}
				</div>
			</div>
			{/* //# --------------------------- Create New Category */}
			<NewCategory />
		</div>
	)
}
