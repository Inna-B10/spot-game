import { prisma } from '@/lib/prisma/client'

//* --------------------- Get List Of Levels By Game-Slug -------------------- */
export async function getLevelsByGameSlug(slug) {
	const game = await prisma.games.findFirst({
		where: { game_slug: slug },
	})
	if (!game) return []

	const levels = await prisma.levels.findMany({
		where: { game_id: game.game_id },
		orderBy: { level_id: 'asc' },
	})

	return levels
}
