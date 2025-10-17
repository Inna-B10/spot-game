import { NO_INDEX_PAGE } from '@/constants/seo.constants'
import { getAllGames } from '@/services/server/gamesDB.service'
import { EditorClient } from './EditorClient'

export const metadata = {
	title: 'Editor | Home',
	...NO_INDEX_PAGE,
}

//* ------------------------------- Editor Home Page ------------------------------ */
export default async function EditorPage() {
	//# ------------------------ Fetch all games from DB
	const { data } = await getAllGames()

	return <EditorClient initialGames={data} />
}
