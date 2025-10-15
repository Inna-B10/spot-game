import Editor from '@/components/editor/Editor'
import { prisma } from '@/lib/prisma/client'
import { notFound } from 'next/navigation'

export default async function EditLevel({ params }) {
	const { game, id } = await params
	if (!game || !id) return notFound()

	//# ------------------------ Get Game Info
	const gameDB = await prisma.games.findFirst({
		where: { game_slug: game },
		select: { game_id: true, game_title: true, game_slug: true },
	})

	if (!gameDB) return notFound()

	//# ------------------------ Determine Mode
	const mode = id === 'new' ? 'create' : 'edit'
	let level

	if (mode === 'create') {
		// Initialize an empty level object for "create" mode
		level = {
			game_id: gameDB.game_id,
			level_slug: '',
			image_path: '',
			difficulty: '', //[TODO] optional for now, can be set later in the Editor
			areas: [],
		}
	} else {
		//# ------------------------ Find Level in DB

		level = await prisma.levels.findFirst({
			where: {
				level_slug: id,
				games: { game_slug: game },
			},
		})
		if (!level) return notFound()
	}

	//* ------------------------------- Rendering ------------------------------ */
	return <Editor initialLevel={level} mode={mode} gameDB={gameDB} />
}
