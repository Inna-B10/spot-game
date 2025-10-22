import { isDev } from '@/lib/utils/isDev'
import { dbCreateNewStage, dbUpdateNewStage } from '@/services/server/stagesServer.service'
import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

export async function POST(req, { params }) {
	try {
		// Parse multipart form
		const formData = await req.formData()

		const file = formData.get('file')
		const gameId = Number(formData.get('gameId'))
		const difficulty = formData.get('difficulty') || ''
		const baseName = formData.get('name') || 'image'
		const areas = JSON.parse(formData.get('areas') || '[]')

		const searchParams = await params
		const gameSlug = searchParams?.gameSlug

		if (!file || !gameId || !gameSlug || areas.length === 0) {
			return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
		}

		// STEP 1: create a record to get stage_id
		const newStage = await dbCreateNewStage(gameId, difficulty, areas)
		if (!newStage.success) {
			isDev && console.error('API error in /stage-create-new, newStage:', newStage.error)
			return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
		}
		const stage = newStage.data

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

		const updated = await dbUpdateNewStage(stage.stage_id, stageSlug, imagePath)

		if (!updated.success) {
			isDev && console.error('update new stage error in API /stage-create-new:', updated.error)
			return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
		}
		return NextResponse.json(
			{
				success: true,
				stageSlug: updated.data?.stage_slug,
			},
			{ status: 201 }
		)
	} catch (err) {
		isDev && console.error('API error in /stage-create-new:', err)
		return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
	}
}
