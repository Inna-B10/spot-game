import { isDev } from '@/lib/utils/isDev'
import { createNewGame } from '@/services/server/gamesDB.service'
import { NextResponse } from 'next/server'

export async function POST(req) {
	try {
		const body = await req.json()
		const { title, slug, desc } = body

		const result = await createNewGame({ title, slug, desc })

		if (!result.success) {
			return NextResponse.json(result, { status: 400 })
		}

		return NextResponse.json(result, { status: 201 })
	} catch (error) {
		isDev && console.error('Unhandled error in /api/games/create:', error)
		return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
	}
}
