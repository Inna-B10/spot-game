import Editor from '@/components/editor/Editor'
import { prisma } from '@/lib/prisma/client'
import { notFound } from 'next/navigation'

export default async function EditStage({ params }) {
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
	let stage

	if (mode === 'create') {
		// Initialize an empty stage object for "create" mode
		stage = {
			game_id: gameDB.game_id,
			stage_slug: '',
			image_path: '',
			difficulty: '', //[TODO] optional for now, can be set later in the Editor
			areas: [],
		}
	} else {
		//# ------------------------ Find Stage in DB

		stage = await prisma.stages.findFirst({
			where: {
				stage_slug: id,
				games: { game_slug: game },
			},
		})
		if (!stage) return notFound()
	}

	//* ------------------------------- Rendering ------------------------------ */
	return <Editor initialStage={stage} mode={mode} gameDB={gameDB} />
}
