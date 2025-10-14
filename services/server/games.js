import { prisma } from '@/lib/prisma/client'

//* ---------------------------- Get List Of Games --------------------------- */
export async function getGames(params) {
	return await prisma.games.findMany({
		orderBy: { game_id: 'asc' },
		select: {
			game_id: true,
			game_title: true,
			game_slug: true,
			game_desc: true,
		},
	})
}
