import { isDev } from '@/lib/utils/isDev'
import { dbDeleteGameBySlug } from '@/services/server/gamesServer.service'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function DELETE(req, { params }) {
	try {
		const searchParams = await params
		const { gameSlug } = searchParams

		if (!gameSlug)
			throw {
				message: 'Internal error: Missing required gameSlug',
				details: { gameSlug },
				code: 400,
			}

		const response = await dbDeleteGameBySlug(gameSlug)

		if (!response?.success)
			throw {
				message: 'Failed to delete game.',
				details: response?.error,
				code: 500,
			}

		revalidatePath('/')

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
			console.error('API error in /game-delete: ', {
				message: err.message,
				details: err.details,
			})

		return NextResponse.json(
			{
				success: false,
				error: err.message || 'Internal server error while deleting game.',
			},
			{ status: 500 }
		)
	}
}
