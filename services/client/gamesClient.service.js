import { axiosClient } from '@/lib/utils/axiosClient'
import { isDev } from '@/lib/utils/isDev'

//* ------------------------------- Create Game ------------------------------ */
export async function apiCreateNewGame({ title, slug, desc }) {
	try {
		const res = await axiosClient.post('/api/games/create', { title, slug, desc })
		return res.data
	} catch (err) {
		isDev && console.error('Request create game failed:', err)
		return { success: false, error: err.message }
	}
}

//* ---------------------------- Get List Of Games --------------------------- */
export async function apiGetAllGames() {
	try {
		const res = await axiosClient.get('/api/games/list')
		return res.data
	} catch (err) {
		isDev && console.error('Request get all games failed:', err)
		return { success: false, error: err.message }
	}
}
//* --------------------------- Update Description --------------------------- */
export async function apiUpdateGameDesc(gameSlug, desc) {
	if (!gameSlug) {
		alert('Missing gameSlug')
		return
	}
	try {
		const { data } = await axiosClient.put('/api/games/update-desc', { gameSlug, desc })

		return data
	} catch (err) {
		isDev && console.error('Request update game desc failed:', err)
		return { success: false, error: err.message }
	}
}
