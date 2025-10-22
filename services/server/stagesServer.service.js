import { prisma } from '@/lib/prisma/client'
import { isDev } from '@/lib/utils/isDev'
import { dbGetGameBySlug } from './gamesServer.service'

//* ----------------------------- Get All Stages ----------------------------- */
export async function dbGetAllStages() {
	try {
		const data = await prisma.stages.findMany({
			select: {
				stage_slug: true,
				games: {
					select: { game_slug: true },
				},
			},
		})
		return { success: true, data }
	} catch (err) {
		isDev && console.error('DB Error, fetching all stages:', err)
		return { success: false, error: err.message }
	}
}

//* ----------------------- Get All Stages By Game-Slug ---------------------- */
export async function dbGetStagesByGameSlug(gameSlug) {
	try {
		const { data: game } = await dbGetGameBySlug(gameSlug)
		if (!game) return { success: false, data: game }

		const data = await prisma.stages.findMany({
			where: { game_id: game.game_id },
			orderBy: { stage_id: 'asc' },
		})

		return { success: true, data }
	} catch (err) {
		isDev && console.error('DB Error, get stages by gameSlug:', err)
		return { success: false, error: err.message }
	}
}

//* ---------------------- Get Single Stage By Stage-slug --------------------- */
export async function dbGetStageByStageSlug(stageSlug, gameSlug) {
	try {
		const data = await prisma.stages.findFirst({
			where: {
				stage_slug: stageSlug,
				games: { game_slug: gameSlug },
			},
			include: {
				games: true, // to get game_title, game_desc
			},
		})
		return { success: true, data }
	} catch (err) {
		isDev && console.error('DB Error, get stage by stageSlug:', err)
		return { success: false, error: err.message }
	}
}

//* ----------------------------- Get Next Stage ----------------------------- */
export async function dbGetNextStage(gameId, stageId) {
	try {
		const data = await prisma.stages.findFirst({
			where: {
				game_id: gameId,
				stage_id: { gt: stageId },
			},
			orderBy: { stage_id: 'asc' },
			select: { stage_slug: true },
		})
		return { success: true, data }
	} catch (err) {
		isDev && console.error('DB Error, get next stage:', err)
		return { success: false, error: err.message }
	}
}

//* ---------------------------- Create New Stage ---------------------------- */
export async function dbCreateNewStage(gameId, difficulty, areas) {
	try {
		const data = await prisma.stages.create({
			data: {
				game_id: gameId,
				difficulty,
				areas,
				image_path: '', // will update after upload image
				stage_slug: '', // will update after upload image
			},
			select: { stage_id: true },
		})
		return { success: true, data }
	} catch (err) {
		isDev && console.error('DB Error, create new stage:', err)
		return { success: false, error: err.message }
	}
}

//* ---------------------------- Update New Stage ---------------------------- */
export async function dbUpdateNewStage(stageId, stageSlug, imagePath) {
	try {
		const data = await prisma.stages.update({
			where: { stage_id: stageId },
			data: {
				stage_slug: stageSlug,
				image_path: imagePath,
			},
			select: {
				stage_slug: true,
			},
		})
		return { success: true, data }
	} catch (err) {
		isDev && console.error('DB Error, update just created stage:', err)
		return { success: false, error: err.message }
	}
}

//* -------------------------- Update Existing Stage ------------------------- */
export async function dbUpdateExistingStage(stageSlug, imageUrl, areas, difficulty = null) {
	try {
		const data = await prisma.stages.update({
			where: { stage_slug: stageSlug },
			data: {
				image_path: imageUrl,
				areas,
				difficulty,
			},
		})

		return { success: true }
	} catch (err) {
		isDev && console.error('DB Error, update stage by stageSlug:', err)
		return { success: false, error: err.message }
	}
}
