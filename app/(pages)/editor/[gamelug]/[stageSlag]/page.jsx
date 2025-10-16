import NotFoundPage from '@/app/not-found'
import Editor from '@/components/editor/Editor'
import { prisma } from '@/lib/prisma/client'

export default async function EditStage({ params }) {
	const { gameSlag, stageSlug } = await params
	if (!gameSlag || !stageSlug) return NotFoundPage()

	//# ------------------------ Get Game Info
	const gameDB = await prisma.games.findFirst({
		where: { game_slug: gameSlag },
		select: { game_id: true, game_title: true, game_slug: true },
	})

	if (!gameDB) return NotFoundPage()

	//# ------------------------ Determine Mode
	const mode = stageSlug === 'new' ? 'create' : 'edit'
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
				stage_slug: stageSlug,
				games: { game_slug: gameSlag },
			},
		})
		if (!stage) return NotFoundPage()
	}

	//* ------------------------------- Rendering ------------------------------ */
	return <Editor initialStage={stage} mode={mode} gameDB={gameDB} />
}
