import { isDev } from '@/lib/utils/isDev'
import { dbUpdateGameDesc } from '@/services/server/gamesServer.service'
import { NextResponse } from 'next/server'

export async function PUT(req) {
	try {
		const { gameSlug, desc } = await req.json()
		if (!gameSlug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 })

		const result = await dbUpdateGameDesc(gameSlug, desc)
		if (!result.success) return NextResponse.json(result, { status: 400 })

		return NextResponse.json(result, { status: 200 })
	} catch (err) {
		isDev && console.error('Unhandled error in /api/games/update-desc:', err)
		return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
	}
}
