'use client'

import { LinkButton } from '@/components/ui/buttons/LinkButton'
import { apiGetAllGames } from '@/services/client/gamesClient.service'
import { useEffect, useState } from 'react'
import { NewCategory } from './NewCategory'

export function EditorClient({ initialGames }) {
	const [games, setGames] = useState(initialGames)
	const [isAddedNew, setIsAddedNew] = useState(false)

	// Reload list after a new game is added
	useEffect(() => {
		if (!isAddedNew) return

		async function fetchGames() {
			const { data } = await apiGetAllGames()
			if (data && data.length > 0) setGames(data)

			setIsAddedNew(false)
		}

		fetchGames()
	}, [isAddedNew])

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
				<h2 className='text-2xl font-semibold'>Choose category</h2>
				<div className='flex flex-wrap gap-2'>
					{games.length > 0 ? (
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
			{/* //# --------------------------- Create New Category -------------------------- */}
			<NewCategory setIsAddedNew={setIsAddedNew} />
		</div>
	)
}
