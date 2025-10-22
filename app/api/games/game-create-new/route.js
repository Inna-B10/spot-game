import { isDev } from '@/lib/utils/isDev'
import { dbCreateNewGame } from '@/services/server/gamesServer.service'
import { NextResponse } from 'next/server'

export async function POST(req) {
	try {
		const body = await req.json()
		const { title, gameSlug, desc } = body

		if (!title || !gameSlug) {
			return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
		}

		const result = await dbCreateNewGame({ title, gameSlug, desc })

		if (!result.success) {
			return NextResponse.json({ success: false, error: result.error }, { status: 400 })
		}

		return NextResponse.json({ success: true, data: result.data }, { status: 201 })
	} catch (error) {
		isDev && console.error('API error in /game-create-new:', error)

		return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
	}
}
