import { axiosClient } from '@/lib/utils/axiosClient'
import { isDev } from '@/lib/utils/isDev'

//* ------------------------------- Create Game ------------------------------ */
export async function apiCreateNewGame({ title, gameSlug, desc = null }) {
	try {
		if (typeof title !== 'string') throw new Error('Invalid game name format')
		if (!gameSlug || typeof gameSlug !== 'string') throw new Error('Invalid or missing gameSlug')
		if (desc && typeof desc !== 'string') throw new Error('Invalid description format')

		const { data } = await axiosClient.post('/api/games/game-create-new', { title, gameSlug, desc })

		if (data?.success) {
			return data.payload
		} else {
			throw new Error(data?.error || 'Failed to create new game.')
		}
	} catch (err) {
		isDev && console.error('Request create new game failed:', err.response?.data?.error, err)

		let errorMsg = ''
		if (err.response?.data?.error === 'Unique constraint failed') {
			errorMsg = 'Name must be unique!\nChange the game name and try again.'
		} else {
			errorMsg = 'Failed to create a new game'
		}

		throw new Error(errorMsg || err.message || 'Failed to create new game.')
	}
}

//* ---------------------------- Get List Of Games --------------------------- */
export async function apiGetAllGames() {
	try {
		const { data } = await axiosClient.get('/api/games/game-get-all')

		if (data?.success) {
			return data.payload
		} else {
			throw new Error(data?.error || 'Failed to fetch list of games.')
		}
	} catch (err) {
		isDev && console.error('Request get all games failed:', err.response?.data?.error, err)

		throw new Error(err.response?.data?.error || err.message)
	}
}

//* ---------------------------- Get Game By Slug ---------------------------- */
// export async function apiGetGameBySlug(gameSlug) {
// 	try {
// 		if (!gameSlug || typeof gameSlug !== 'string') throw new Error('Invalid or missing gameSlug')
//
// 		const { data } = await axiosClient.get(`/api/games/${gameSlug}/get/game-by-slug`)
//
// 		if (data?.success) {
// 			return data.payload
// 		} else {
// 			throw new Error(data?.error || 'Failed to fetch game.')
// 		}
// 	} catch (err) {
// 		isDev && console.error('Request get game by slug failed:', err.response?.data?.error, err)
//
// 		throw new Error(err.response?.data?.error || err.message)
// 	}
// }
//* ------------------------------- Update Game ------------------------------ */
export async function apiUpdateGame(gameSlug, title, desc = null) {
	try {
		if (!gameSlug || typeof gameSlug !== 'string') throw new Error('Invalid or missing gameSlug')
		if (!title || typeof title !== 'string') throw new Error('Invalid or missing title')
		if (desc !== null && typeof desc !== 'string') throw new Error('Invalid description format')

		const { data } = await axiosClient.put(`/api/games/${gameSlug}/game-update`, { title, desc })

		if (data?.success) {
			return data.payload
		} else {
			throw new Error(data?.error || 'Failed to update game.')
		}
	} catch (err) {
		isDev && console.error('Request update game failed:', err.response?.data?.error, err)

		throw new Error(err.response?.data?.error || err.message)
	}
}

//* --------------------------- Delete Game By Slug -------------------------- */
export async function apiDeleteGameBySlug(gameSlug) {
	try {
		if (!gameSlug) throw new Error('Internal error: Missing required gameSlug')

		const { data } = await axiosClient.delete(`/api/games/${gameSlug}/game-delete`)

		if (data?.success) {
			return
		} else {
			throw new Error(data?.error || 'Failed to delete game.')
		}
	} catch (err) {
		isDev && console.error('Request delete game failed:', err.response?.data?.error, err)

		throw new Error(err.response?.data?.error || err.message)
	}
}
