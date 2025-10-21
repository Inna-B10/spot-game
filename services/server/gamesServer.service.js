import { prisma } from '@/lib/prisma/client'
import { isDev } from '@/lib/utils/isDev'

//* ---------------------------- Get List Of Games --------------------------- */
export async function dbGetAllGames() {
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
		isDev && console.error('DB Error fetching games:', err)
		return { success: false, error: err.message }
	}
}

//* ----------------------------- Create New Game ---------------------------- */
export async function dbCreateNewGame({ title, slug, desc }) {
	try {
		await prisma.games.create({
			data: {
				game_title: title,
				game_slug: slug,
				game_desc: desc?.trim() || null,
			},
		})
		return { success: true }
	} catch (err) {
		isDev && console.error('DB Error creating game:', err)
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
		isDev && console.error('DB Error get game name:', err)
		return { success: false, error: err.message }
	}
}

//* --------------------------- Update Description --------------------------- */
export async function dbUpdateGameDesc(slug, desc) {
	try {
		const updated = await prisma.games.update({
			where: { game_slug: slug },
			data: { game_desc: desc },
		})

		return { success: true, data: updated }
	} catch (err) {
		isDev && console.error('DB Error update game description:', err)
		return { success: false, error: err.message }
	}
}
