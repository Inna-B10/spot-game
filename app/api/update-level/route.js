import { prisma } from '@/lib/prisma/client'

export async function PUT(req) {
	try {
		const body = await req.json()
		const { game, payload } = body
		if (!payload || !payload.levelSlug) {
			return new Response(JSON.stringify({ error: 'Missing payload' }), { status: 400 })
		}

		const updated = await prisma.levels.update({
			where: { level_slug: payload.levelSlug },
			data: {
				image_path: payload.imageUrl,
				areas: payload.areas,
				difficulty: payload.difficulty ?? null,
			},
		})

		return new Response(JSON.stringify({ ok: true, updated }), { status: 200 })
	} catch (e) {
		console.error('update-level error', e)
		return new Response(JSON.stringify({ error: e.message }), { status: 500 })
	}
}
