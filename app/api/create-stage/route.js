import { prisma } from '@/lib/prisma/client'
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
		const stage = await prisma.stages.create({
			data: {
				game_id: gameId,
				difficulty,
				areas,
				image_path: '', // will update after upload
				stage_slug: '', // will update after upload
			},
			select: { stage_id: true },
		})

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

		const updated = await prisma.stages.update({
			where: { stage_id: stage.stage_id },
			data: {
				stage_slug: stageSlug,
				image_path: imagePath,
			},
			select: {
				stage_slug: true,
			},
		})

		return new Response(
			JSON.stringify({
				ok: true,
				stageSlug: updated.stage_slug,
			}),
			{ status: 200 }
		)
	} catch (err) {
		console.error('❌ create-stage error:', err)
		return new Response(JSON.stringify({ error: err.message }), { status: 500 })
	}
}
