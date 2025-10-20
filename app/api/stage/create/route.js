import { isDev } from '@/lib/utils/isDev'
import { createNewStage, updateNewStage } from '@/services/server/stagesDB.service'
import { put } from '@vercel/blob'

export async function POST(req) {
	try {
		// Parse multipart form
		const formData = await req.formData()

		const file = formData.get('file')
		const gameId = Number(formData.get('gameId'))
		const difficulty = formData.get('difficulty') || ''
		const baseName = formData.get('name') || 'image'
		const areas = JSON.parse(formData.get('areas') || '[]')
		const gameSlug = req.nextUrl.searchParams.get('gameSlug')

		if (!file || !gameId || !gameSlug || areas.length === 0) {
			return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 })
		}

		// STEP 1: create a record to get stage_id
		const { error, success, data: stage } = await createNewStage(gameId, difficulty, areas)
		if (!success) {
			isDev && console.error('stage-create error:', error)
			return new Response(JSON.stringify({ error: message }), { status: 500 })
		}
		// STEP 2: upload image to Vercel Blob
		const blobName = `${baseName}-${stage.stage_id}`
		const blob = await put(`${gameSlug}/${blobName}`, file, {
			access: 'public',
			addRandomSuffix: true,
			token: process.env.BLOB_READ_WRITE_TOKEN,
		})

		// STEP 3: build final slug and update record
		const stageSlug = `${baseName}-${stage.stage_id}` // e.g. image-6
		const imagePath = `/${gameSlug}/${blob.pathname.split('/').pop()}`
		// e.g. /find-differences/image-6-dkUKnEVyFq2RgaoTUFFqVgNP6E8Q8C.jpg

		const updated = await updateNewStage(stage.stage_id, stageSlug, imagePath)
		if (!success) {
			isDev && console.error('stage-update error:', error)
			return new Response(JSON.stringify({ error: message }), { status: 500 })
		}
		return new Response(
			JSON.stringify({
				success: true,
				stageSlug: updated.stage_slug,
			}),
			{ status: 200 }
		)
	} catch (err) {
		isDev && console.error('API stage-create error:', err)
		return new Response(JSON.stringify({ error: err.message }), { status: 500 })
	}
}
