import { isDev } from '@/lib/utils/isDev'
import { dbUpdateGame } from '@/services/server/gamesServer.service'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function PUT(req, { params }) {
	try {
		const searchParams = await params
		const gameSlug = searchParams?.gameSlug
		const { title, desc } = await req.json()

		if (!gameSlug)
			throw {
				message: 'Missing required gameSlug.',
				details: { gameSlug },
				code: 400,
			}

		const response = await dbUpdateGame(gameSlug, title, desc)
		console.log('API: ', response)

		if (!response.success)
			throw {
				message: 'Failed to update game.',
				details: response.error,
				code: 500,
			}

		revalidatePath(`/${gameSlug}`)

		//# ---------------------------- Return success ----------------------------
		return NextResponse.json(
			{
				success: true,
				payload: response.data,
			},
			{ status: 200 }
		)
	} catch (err) {
		//# ---------------------------------- Catch ---------------------------------
		isDev &&
			console.error('API error in /game-update:', {
				message: err.message,
				details: err.details,
			})

		return NextResponse.json(
			{
				success: false,
				error: err.message || 'Internal server error.',
			},
			{ status: err.code || 500 }
		)
	}
}
