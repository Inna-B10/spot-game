import { isDev } from '@/lib/utils/isDev'
import axios from 'axios'

//* ------------------------------- Create Game ------------------------------ */
export async function apiCreateGame({ title, slug, desc }) {
	try {
		const res = await axios.post('/api/games/create', { title, slug, desc })
		return res.data
	} catch (err) {
		isDev && console.error('Request create game failed:', err)
		return { success: false, error: err.message }
	}
}

//* ---------------------------- Get List Of Games --------------------------- */
export async function apiGetAllGames() {
	try {
		const res = await axios.get('/api/games/list')
		return res.data
	} catch (err) {
		isDev && console.error('Request get all games failed:', err)
		return { success: false, error: err.message }
	}
}
