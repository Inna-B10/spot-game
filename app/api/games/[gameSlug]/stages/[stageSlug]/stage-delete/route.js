import { isDev } from '@/lib/utils/isDev'
import { dbDeleteStageBySlug } from '@/services/server/stagesServer.service'
import { NextResponse } from 'next/server'

export async function DELETE(req, { params }) {
	try {
		const searchParams = await params
		const { gameSlug, stageSlug } = searchParams

		if (!gameSlug || !stageSlug) {
			throw {
				message: 'Internal error: Missing required gameSlug or stageSlug.',
				details: { gameSlug, stageSlug },
				code: 400,
			}
		}

		const response = await dbDeleteStageBySlug(stageSlug)

		if (!response?.success)
			throw {
				message: 'Failed to delete the stage.',
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
			console.error('API error in /stage-delete: ', {
				message: err.message,
				details: err.details,
			})

		return NextResponse.json(
			{
				success: false,
				error: err.message || 'Internal server error while deleting stage.',
			},
			{ status: 500 }
		)
	}
}
