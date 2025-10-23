import { isDev } from '@/lib/utils/isDev'
import { dbCreateNewGame } from '@/services/server/gamesServer.service'
import { NextResponse } from 'next/server'

export async function POST(req) {
	try {
		const body = await req.json()
		const { title, gameSlug, desc } = body

		if (!title || !gameSlug)
			throw {
				message: 'Missing required fields.',
				details: { title, gameSlug },
				code: 400,
			}

		const result = await dbCreateNewGame({ title, gameSlug, desc })

		if (!result.success) {
			const msg = result.error === 'Unique constraint failed' ? 'Unique constraint failed' : 'Failed to create new game'
			throw {
				message: msg,
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
			{ status: 201 }
		)
	} catch (err) {
		isDev &&
			console.error('API error in /game-create-new:', {
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
