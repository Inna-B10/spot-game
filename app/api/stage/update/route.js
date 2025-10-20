import { updateExistStage } from '@/services/server/stagesDB.service'

export async function PUT(req) {
	try {
		const body = await req.json()
		const { payload } = body
		if (!payload || !payload.stageSlug) {
			return new Response(JSON.stringify({ error: 'Missing payload' }), { status: 400 })
		}

		const success = await updateExistStage(payload.stageSlug, payload.imageUrl, payload.areas, payload.difficulty)

		return new Response(JSON.stringify(success), { status: 200 })
	} catch (e) {
		console.error('stage-update error', e)
		return new Response(JSON.stringify({ error: e.message }), { status: 500 })
	}
}
