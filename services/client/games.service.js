import { isDev } from '@/lib/utils/isDev'
import axios from 'axios'

//* ------------------------------- Create Game ------------------------------ */
export async function apiCreateGame({ title, slug, desc }) {
	try {
		const res = await axios.post('/api/games/create', { title, slug, desc })
		return res.data
	} catch (error) {
		isDev && console.error('Request failed:', error)
		return { success: false, error: error.message }
	}
}
