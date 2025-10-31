import { prisma } from '@/lib/prisma/client'
import { isDev } from '@/lib/utils/isDev'

//* ---------------------------- Get List Of Games --------------------------- */
export async function dbGetAllGames() {
	console.log('dbGetAllGames runs')
	try {
		const data = await prisma.games.findMany({
			orderBy: { game_id: 'asc' },
			select: {
				game_id: true,
				game_title: true,
				game_slug: true,
				game_desc: true,
			},
		})

		return { success: true, data }
	} catch (err) {
		isDev && console.error('DB Error, fetching all games:', err)
		return { success: false, error: err.message }
	}
}

//* ----------------------------- Create New Game ---------------------------- */
export async function dbCreateNewGame({ title, gameSlug, desc }) {
	try {
		const data = await prisma.games.create({
			data: {
				game_title: title?.trim(),
				game_slug: gameSlug?.trim(),
				game_desc: desc?.trim() || null,
			},
		})
		return { success: true, data }
	} catch (err) {
		isDev && console.error('DB Error, create new game:', err)

		if (err.code === 'P2002') {
			return { success: false, error: 'Unique constraint failed' }
		}

		return { success: false, error: err.message }
	}
}

//* ------------------------- Get Single Game By Slug ------------------------ */
export async function dbGetGameBySlug(gameSlug) {
	try {
		const data = await prisma.games.findFirst({
			where: { game_slug: gameSlug },
		})
		return { success: true, data }
	} catch (err) {
		isDev && console.error('DB Error, game name by slug:', err)
		return { success: false, error: err.message }
	}
}

//* ------------------------ Update Game Description ------------------------- */
export async function dbUpdateGameDesc(gameSlug, desc) {
	try {
		const data = await prisma.games.update({
			where: { game_slug: gameSlug },
			data: { game_desc: desc?.trim() },
		})

		return { success: true, data }
	} catch (err) {
		isDev && console.error('DB Error, update game description:', err)
		return { success: false, error: err.message }
	}
}

//* --------------------------- Delete Game By Slug -------------------------- */
export async function dbDeleteGameBySlug(gameSlug) {
	try {
		const data = await prisma.games.delete({
			where: { game_slug: gameSlug },
		})

		return { success: true }
	} catch (err) {
		isDev && console.error('DB Error, delete game by gameSlug:', err)

		return { success: false, error: err.message }
	}
}
