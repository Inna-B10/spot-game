import NotFoundPage from '@/app/not-found'
import Editor from '@/components/editor/Editor'
import { dbGetGameBySlug } from '@/services/server/gamesServer.service'
import { dbGetStageByStageSlug } from '@/services/server/stagesServer.service'

export default async function EditStage({ params }) {
	const { gameSlug, stageSlug } = await params
	if (!gameSlug || !stageSlug) return NotFoundPage()

	//# ------------------------ Get Game Info
	const { data: gameDB } = await dbGetGameBySlug(gameSlug)

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
			difficulty: '',
			areas: [],
		}
	} else {
		//# ------------------------ Find Stage in DB

		const { data } = await dbGetStageByStageSlug(stageSlug, gameSlug)

		if (!data) return NotFoundPage()

		stage = data
	}

	//* --------------------------------- Render --------------------------------- */
	return <Editor initialStage={stage} mode={mode} gameDB={gameDB} />
}
