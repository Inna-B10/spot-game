import { axiosClient } from '@/lib/utils/axiosClient'
import { isDev } from '@/lib/utils/isDev'

//* ------------------------------- Create Game ------------------------------ */
export async function apiCreateNewGame({ title, gameSlug, desc }) {
	if (typeof title !== 'string') throw new Error('Invalid game name format')
	if (!gameSlug || typeof gameSlug !== 'string') throw new Error('Invalid or missing gameSlug')
	if (typeof desc !== 'string') throw new Error('Invalid description format')

	try {
		const { data } = await axiosClient.post('/api/games/game-create-new', { title, gameSlug, desc })
		return data
	} catch (err) {
		isDev && console.error('Request create new game failed:', err)

		let errorMsg = ''
		if (err.response?.data?.error === 'Unique constraint failed') {
			errorMsg = 'Name must be unique!\nChange the game name and try again.'
		} else {
			errorMsg = 'Failed to create a new game'
		}

		throw new Error(errorMsg)
	}
}

//* ---------------------------- Get List Of Games --------------------------- */
export async function apiGetAllGames() {
	try {
		const { data } = await axiosClient.get('/api/games/game-get-all')
		return data
	} catch (err) {
		isDev && console.error('Request get all games failed:', err)

		throw new Error('Failed to fetch list of games.')
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
	if (!gameSlug || typeof gameSlug !== 'string') throw new Error('Invalid or missing gameSlug')
	if (typeof desc !== 'string') throw new Error('Invalid description format')

	try {
		const { data } = await axiosClient.put(`/api/games/${gameSlug}/game-update-desc`, { desc })
		return data
	} catch (err) {
		isDev && console.error('Request update game desc failed:', err)

		throw new Error('Failed to edit description.')
	}
}
