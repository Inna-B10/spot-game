import { isDev } from '@/lib/utils/isDev'
import { dbCreateNewStage, dbUpdateNewStage } from '@/services/server/stagesServer.service'
import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

export async function POST(req, { params }) {
	try {
		//# Parse multipart form
		const formData = await req.formData()

		const file = formData.get('file')
		const gameId = Number(formData.get('gameId'))
		const difficulty = formData.get('difficulty') || ''
		const baseName = formData.get('name') || 'image'
		const areas = JSON.parse(formData.get('areas') || '[]')

		const searchParams = await params
		const gameSlug = searchParams?.gameSlug

		if (!file || !gameId || !gameSlug || areas.length === 0) {
			throw {
				message: 'Missing required fields.',
				details: { file, gameId, gameSlug, areas },
				code: 400,
			}
		}

		//# STEP 1: create a record to get stage_id
		const newStage = await dbCreateNewStage(gameId, difficulty, areas)
		if (!newStage.success) {
			throw {
				message: 'Could not create new stage and get new stage_id.',
				details: { newStage },
				code: 500,
			}
		}
		const stage = newStage.data

		//# STEP 2 + 3: upload image to Vercel Blob + build final slug
		const blobName = `${baseName}-${stage.stage_id}`

		// Upload to Vercel Blob
		const blob = await put(`${gameSlug}/${blobName}`, file, {
			access: 'public',
			addRandomSuffix: true,
			token: process.env.BLOB_READ_WRITE_TOKEN,
		})

		// Validate blob object
		if (!blob?.pathname || !blob?.url) {
			throw {
				message: 'Invalid blob response from Vercel Blob.',
				details: blob,
				code: 502,
			}
		}

		// Build and validate resulting fields
		const stageSlug = `${baseName}-${stage.stage_id}`
		const imagePath = `/${gameSlug}/${blob.pathname.split('/').pop()}`

		if (!imagePath || typeof imagePath !== 'string') {
			throw {
				message: 'Missing or invalid imagePath.',
				details: { blob, imagePath },
				code: 400,
			}
		}

		if (!stageSlug || typeof stageSlug !== 'string') {
			throw {
				message: 'Missing or invalid stageSlug.',
				details: { stageSlug },
				code: 400,
			}
		}

		//# STEP 4: insert stageSlug and imagePath to just created stage
		const updated = await dbUpdateNewStage(stage.stage_id, stageSlug, imagePath)

		if (!updated.success) {
			throw {
				message: 'Failed to update stage record after upload.',
				details: updated.error,
				code: 500,
			}
		}

		return NextResponse.json(
			{
				success: true,
				stageSlug: updated.data?.stage_slug,
			},
			{ status: 201 }
		)
	} catch (err) {
		isDev &&
			console.error('API error in /stage-create-new:', {
				message: err.message,
				details: err.details,
			})

		return NextResponse.json(
			{
				success: false,
				error: err.message || 'Internal server error during image upload.',
			},
			{ status: err.code || 500 }
		)
	}
}
