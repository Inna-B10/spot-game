import { prisma } from '@/lib/prisma/client'
import { isDev } from '@/lib/utils/isDev'
import { getGameBySlug } from './gamesDB.service'

//* ----------------------------- Get All Stages ----------------------------- */
export async function getAllStages() {
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
		isDev && console.error('Error fetching stages:', err)
		return { success: false, error: err.message }
	}
}

//* -------------------------- Get Stages By Game-Slug ---------------------- */
export async function getStagesByGameSlug(gameSlug) {
	try {
		const { data: game } = await getGameBySlug(gameSlug)
		if (!game) return []

		const data = await prisma.stages.findMany({
			where: { game_id: game.game_id },
			orderBy: { stage_id: 'asc' },
		})

		return { success: true, data }
	} catch (err) {
		isDev && console.error('Error fetching stages:', err)
		return { success: false, error: err.message }
	}
}

//* ------------------------- Get Stage By Stage-slug ------------------------ */
export async function getStageByStageSlug(stageSlug, gameSlug) {
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
		isDev && console.error('Error fetching stages:', err)
		return { success: false, error: err.message }
	}
}

//* ----------------------------- Get Next Stage ----------------------------- */
export async function getNextStage(gameId, stageId) {
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
		isDev && console.error('Error fetching next stage:', err)
		return { success: false, error: err.message }
	}
}

//* ---------------------------- Create New Stage ---------------------------- */
export async function createNewStage(gameId, difficulty, areas) {
	try {
		const data = await prisma.stages.create({
			data: {
				game_id: gameId,
				difficulty,
				areas,
				image_path: '', // will update after upload
				stage_slug: '', // will update after upload
			},
			select: { stage_id: true },
		})
		return { success: true, data }
	} catch (err) {
		isDev && console.error('Error creating new stage:', err)
		return { success: false, error: err.message }
	}
}

//* ---------------------------- Update New Stage ---------------------------- */
export async function updateNewStage(stageId, stageSlug, imagePath) {
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
		isDev && console.error('Error updating stage:', err)
		return { success: false, error: err.message }
	}
}

//* --------------------------- Update Exist Stage --------------------------- */
export async function updateExistStage(stageSlug, imageUrl, areas, difficulty = null) {
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
		isDev && console.error('Error updating stage:', err)
		return { success: false, error: err.message }
	}
}
