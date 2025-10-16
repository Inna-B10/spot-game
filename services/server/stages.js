import { prisma } from '@/lib/prisma/client'

//* --------------------- Get List Of Stages By Game-Slug -------------------- */
export async function getStagesByGameSlug(slug) {
	const game = await prisma.games.findFirst({
		where: { game_slug: slug },
	})
	if (!game) return []

	const stages = await prisma.stages.findMany({
		where: { game_id: game.game_id },
		orderBy: { stage_id: 'asc' },
	})

	return stages
}
