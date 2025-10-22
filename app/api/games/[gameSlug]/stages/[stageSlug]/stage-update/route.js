import { isDev } from '@/lib/utils/isDev'
import { dbUpdateExistingStage } from '@/services/server/stagesServer.service'
import { NextResponse } from 'next/server'

export async function PUT(req) {
	try {
		const body = await req.json()
		const { payload } = body

		if (!payload || !payload.stageSlug) {
			return NextResponse.json({ success: false, error: 'Missing payload' }, { status: 400 })
		}

		const success = await dbUpdateExistingStage(payload.stageSlug, payload.imageUrl, payload.areas, payload.difficulty)

		if (!success) {
			return NextResponse.json(success, { status: 400 })
		}

		return NextResponse.json(success, { status: 200 })
	} catch (err) {
		isDev && console.error('API error in /stage-update', err)

		return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
	}
}
