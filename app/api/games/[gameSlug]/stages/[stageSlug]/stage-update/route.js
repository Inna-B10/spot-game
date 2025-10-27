import { isDev } from '@/lib/utils/isDev'
import { dbUpdateExistingStage } from '@/services/server/stagesServer.service'
import { NextResponse } from 'next/server'

export async function PUT(req, { params }) {
	try {
		const searchParams = await params
		const stageSlug = searchParams?.stageSlug
		const body = await req.json()
		const { payload } = body || {}

		//# ---------------------------- Validate payload ----------------------------
		if (!payload) throw { message: 'Missing "payload" in request body.', code: 400 }

		if (stageSlug !== payload.stageSlug) throw { message: 'Mismatching "stageSlug" in URL and payload.', code: 400 }

		if (!payload.imageUrl || typeof payload.imageUrl !== 'string') throw { message: 'Missing or invalid "imageUrl".', code: 400 }

		if (!Array.isArray(payload.areas) || payload.areas.length === 0) throw { message: 'Missing or invalid "areas" data.', code: 400 }

		if (!payload.difficulty || typeof payload.difficulty !== 'string') throw { message: 'Missing or invalid "difficulty" format.', code: 400 }
		if (typeof payload.task !== 'string') throw { message: 'Invalid "task" format.', code: 400 }

		//# ---------------------------- Update stage in DB ----------------------------
		const result = await dbUpdateExistingStage(payload)

		if (!result?.success)
			throw {
				message: 'Failed to update stage in database.',
				details: result?.error,
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
