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
		const gameSlug = req.nextUrl.searchParams.get('game')

		if (!file || !gameId || !gameSlug || areas.length === 0) {
			return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 })
		}

		// STEP 1: create a record to get level_id
		const level = await prisma.levels.create({
			data: {
				game_id: gameId,
				difficulty,
				areas,
				image_path: '', // will update after upload
				level_slug: '', // will update after upload
			},
			select: { level_id: true },
		})

		// STEP 2: upload image to Vercel Blob
		const blobName = `${baseName}-${level.level_id}`
		const blob = await put(`${gameSlug}/${blobName}`, file, {
			access: 'public',
			addRandomSuffix: true,
			token: process.env.BLOB_READ_WRITE_TOKEN,
		})

		// STEP 3: build final slug and update record
		const levelSlug = `${baseName}-${level.level_id}` // e.g. image-6
		const imagePath = `/${gameSlug}/${blob.pathname.split('/').pop()}`
		// e.g. /find-differences/image-6-dkUKnEVyFq2RgaoTUFFqVgNP6E8Q8C.jpg

		const updated = await prisma.levels.update({
			where: { level_id: level.level_id },
			data: {
				level_slug: levelSlug,
				image_path: imagePath,
			},
			select: {
				level_slug: true,
			},
		})

		return new Response(
			JSON.stringify({
				ok: true,
				levelSlug: updated.level_slug,
			}),
			{ status: 200 }
		)
	} catch (err) {
		console.error('❌ create-level error:', err)
		return new Response(JSON.stringify({ error: err.message }), { status: 500 })
	}
}
