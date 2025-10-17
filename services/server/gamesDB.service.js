import { prisma } from '@/lib/prisma/client'
import { isDev } from '@/lib/utils/isDev'

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

//* ------------------------------- Create New ------------------------------- */
export async function createNewGame({ title, slug, desc }) {
	try {
		await prisma.games.create({
			data: {
				game_title: title,
				game_slug: slug,
				game_desc: desc?.trim() || null,
			},
		})
		return { success: true }
	} catch (error) {
		isDev && console.error('Error creating game:', error)
		return { success: false, error: error.message }
	}
}
