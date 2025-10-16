import { prisma } from '@/lib/prisma/client'

export async function PUT(req) {
	try {
		const body = await req.json()
		const { game, payload } = body
		if (!payload || !payload.stageSlug) {
			return new Response(JSON.stringify({ error: 'Missing payload' }), { status: 400 })
		}

		const updated = await prisma.stages.update({
			where: { stage_slug: payload.stageSlug },
			data: {
				image_path: payload.imageUrl,
				areas: payload.areas,
				difficulty: payload.difficulty ?? null,
			},
		})

		return new Response(JSON.stringify({ ok: true, updated }), { status: 200 })
	} catch (e) {
		console.error('update-stage error', e)
		return new Response(JSON.stringify({ error: e.message }), { status: 500 })
	}
}
