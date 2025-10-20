import NotFoundPage from '@/app/not-found'
import Editor from '@/components/editor/Editor'
import { getGameBySlug } from '@/services/server/gamesDB.service'
import { getStageByStageSlug } from '@/services/server/stagesDB.service'

export default async function EditStage({ params }) {
	const { gameSlug, stageSlug } = await params
	if (!gameSlug || !stageSlug) return NotFoundPage()

	//# ------------------------ Get Game Info
	const { data: gameDB } = await getGameBySlug(gameSlug)

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

		const { data } = await getStageByStageSlug(stageSlug, gameSlug)
		if (!data) return NotFoundPage()
		stage = data
	}

	//* ------------------------------- Rendering ------------------------------ */
	return <Editor initialStage={stage} mode={mode} gameDB={gameDB} />
}
