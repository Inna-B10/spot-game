import { isDev } from '@/lib/utils/isDev'
import { dbUpdateGameDesc } from '@/services/server/gamesServer.service'
import { NextResponse } from 'next/server'

export async function PUT(req, { params }) {
	try {
		const searchParams = await params
		const gameSlug = searchParams?.gameSlug
		const { desc } = await req.json()

		if (!gameSlug)
			throw {
				message: 'Missing required gameSlug.',
				details: { gameSlug },
				code: 400,
			}

		const result = await dbUpdateGameDesc(gameSlug, desc)

		if (!result.success)
			throw {
				message: 'Failed to update game description.',
				details: result.error,
				code: 500,
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
		isDev &&
			console.error('API error in /game-update-desc:', {
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
