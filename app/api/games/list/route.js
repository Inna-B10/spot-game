import { isDev } from '@/lib/utils/isDev'
import { getAllGames } from '@/services/server/gamesDB.service'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const result = await getAllGames()

		if (!result.success) {
			return NextResponse.json(result, { status: 400 })
		}
		return NextResponse.json(result.data, { status: 200 })
	} catch (err) {
		isDev && console.error('Unhandled error in /api/games/list:', err)
		return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
	}
}
