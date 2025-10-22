import { isDev } from '@/lib/utils/isDev'
import { dbGetGameBySlug } from '@/services/server/gamesServer.service'
import { NextResponse } from 'next/server'

export async function GET(req, { params }) {
	const searchParams = await params
	const gameSlug = searchParams.gameSlug

	try {
		if (!gameSlug) {
			return NextResponse.json({ success: false, error: 'Missing required field' }, { status: 400 })
		}
		const result = await dbGetGameBySlug(gameSlug)

		if (!result.success) {
			return NextResponse.json(result, { status: 400 })
		}
		return NextResponse.json(result, { status: 200 })
	} catch (err) {
		isDev && console.error('API Error, get name by slug:', err)
		return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
	}
}
