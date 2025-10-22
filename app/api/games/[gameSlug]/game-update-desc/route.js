import { isDev } from '@/lib/utils/isDev'
import { dbUpdateGameDesc } from '@/services/server/gamesServer.service'
import { NextResponse } from 'next/server'

export async function PUT(req, { params }) {
	try {
		const searchParams = await params
		const gameSlug = searchParams?.gameSlug
		const { desc } = await req.json()

		if (!gameSlug) return NextResponse.json({ success: false, error: 'Missing slug' }, { status: 400 })

		const result = await dbUpdateGameDesc(gameSlug, desc)

		if (!result.success) {
			return NextResponse.json({ success: false, error: result.error }, { status: 400 })
		}

		return NextResponse.json({ success: true, data: result.data }, { status: 200 })
	} catch (err) {
		isDev && console.error('API error in /game-update-desc:', err)

		return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
	}
}
