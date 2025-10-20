import { NO_INDEX_PAGE } from '@/constants/seo.constants'
import { dbGetAllGames } from '@/services/server/gamesServer.service'
import { EditorClient } from './EditorClient'

export const metadata = {
	title: 'Editor | Home',
	...NO_INDEX_PAGE,
}

//* ------------------------------- Editor Home Page ------------------------------ */
export default async function EditorPage() {
	//# ------------------------ Fetch all games from DB
	const { data } = await dbGetAllGames()

	return <EditorClient initialGames={data} />
}
