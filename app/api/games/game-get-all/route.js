import { isDev } from '@/lib/utils/isDev'
import { dbGetAllGames } from '@/services/server/gamesServer.service'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const response = await dbGetAllGames()

		if (!response.success)
			throw {
				message: 'Failed to fetch list of games.',
				details: response.error,
				code: 500,
			}

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
			console.error('API error in /game-get-all:', {
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
