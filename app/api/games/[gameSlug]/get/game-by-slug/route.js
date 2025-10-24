import { isDev } from '@/lib/utils/isDev'
import { dbGetGameBySlug } from '@/services/server/gamesServer.service'
import { NextResponse } from 'next/server'

export async function GET(req, { params }) {
	const searchParams = await params
	const gameSlug = searchParams.gameSlug

	try {
		if (!gameSlug) {
			throw {
				message: 'Missing required gameSlug.',
				details: { gameSlug },
				code: 400,
			}
		}

		const result = await dbGetGameBySlug(gameSlug)

		if (!result.success) {
			throw {
				message: 'Failed to fetch the game.',
				details: result.error,
				code: 500,
			}
		}

		//# ---------------------------- Return success ----------------------------
		return NextResponse.json(
			{
				success: true,
				data: result.data,
			},
			{ status: 200 }
		)
	} catch (err) {
		//# ---------------------------------- Catch ---------------------------------
		isDev &&
			console.error('API error in /game-by-slug:', {
				message: err.message,
				details: err.details,
			})

		return NextResponse.json(
			{
				success: false,
				error: err.message || 'Internal server error',
			},
			{ status: err.code || 500 }
		)
	}
}
