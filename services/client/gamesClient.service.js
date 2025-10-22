import { axiosClient } from '@/lib/utils/axiosClient'
import { isDev } from '@/lib/utils/isDev'

//* ------------------------------- Create Game ------------------------------ */
export async function apiCreateNewGame({ title, slug, desc }) {
	try {
		const { data } = await axiosClient.post('/api/games/game-create-new', { title, slug, desc })

		return data
	} catch (err) {
		isDev && console.error('Request create new game failed:', err)

		if (err.response.data.error.includes('Unique constraint failed')) {
			return { success: false, error: 'Name must be unique!\nChange the game name and try again.' }
		} else {
			return { success: false, error: err.message }
		}
	}
}

//* ---------------------------- Get List Of Games --------------------------- */
export async function apiGetAllGames() {
	try {
		const { data } = await axiosClient.get('/api/games/game-get-all')

		return data
	} catch (err) {
		isDev && console.error('Request get all games failed:', err)
		return { success: false, error: err.message }
	}
}

//* ---------------------------- Get Game By Slug ---------------------------- */
// export async function apiGetGameBySlug(gameSlug) {
// 	try {
// 		const {data} = await axiosClient.get(`/api/games/${gameSlug}/get/game-by-slug`)
// 		return data
// 	} catch (err) {
// 		isDev && console.error('Request get game by slug failed:', err)
// 		return { success: false, error: err.message }
// 	}
// }
//* --------------------------- Update Description --------------------------- */
export async function apiUpdateGameDesc(gameSlug, desc) {
	try {
		const { data } = await axiosClient.put(`/api/games/${gameSlug}/game-update-desc`, { desc })

		return data
	} catch (err) {
		isDev && console.error('Request update game desc failed:', err)
		return { success: false, error: err.message }
	}
}
