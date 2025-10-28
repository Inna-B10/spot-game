import { isDev } from '@/lib/utils/isDev'
import { dbUpdateExistingStage } from '@/services/server/stagesServer.service'
import { NextResponse } from 'next/server'

export async function PUT(req, { params }) {
	try {
		const searchParams = await params
		const stageSlug = searchParams?.stageSlug
		const body = await req.json()
		const { updatedStage } = body || {}

		//# ---------------------------- Validate updatedStage ----------------------------
		if (!updatedStage) throw { message: 'Missing "updatedStage" in request body.', code: 400 }

		if (stageSlug !== updatedStage.stageSlug) throw { message: 'Mismatching "stageSlug" in URL and updatedStage.', code: 400 }

		if (!updatedStage.imageUrl || typeof updatedStage.imageUrl !== 'string') throw { message: 'Missing or invalid "imageUrl".', code: 400 }

		if (!Array.isArray(updatedStage.areas) || updatedStage.areas.length === 0) throw { message: 'Missing or invalid "areas" data.', code: 400 }

		if (!updatedStage.difficulty) throw { message: 'Missing required "difficulty".', code: 400 }

		if (typeof updatedStage.task !== 'string') throw { message: 'Invalid format for "task".', code: 400 }

		//# ---------------------------- Update stage in DB ----------------------------
		const response = await dbUpdateExistingStage(updatedStage)

		if (!response?.success)
			throw {
				message: 'Failed to update stage.',
				details: response?.error,
				code: 500,
			}

		//# ---------------------------- Return success ----------------------------
		return NextResponse.json(
			{
				success: true,
			},
			{ status: 200 }
		)
	} catch (err) {
		//# ---------------------------------- Catch ---------------------------------
		isDev &&
			console.error('API error in /stage-update: ', {
				message: err.message,
				details: err.details,
			})

		return NextResponse.json(
			{
				success: false,
				error: err.message || 'Internal server error while updating stage.',
			},
			{ status: 500 }
		)
	}
}
