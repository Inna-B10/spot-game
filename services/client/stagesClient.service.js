import { axiosClient } from '@/lib/utils/axiosClient'
import { isDev } from '@/lib/utils/isDev'
import axios from 'axios'

//* ---------------------------- Create New Stage ---------------------------- */
export async function apiCreateStage(gameSlug, formData) {
	try {
		const { data } = await axios.post(`/api/games/${gameSlug}/stages/stage-create-new`, formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		})

		return { success: true, data }
	} catch (err) {
		isDev && console.error('Client create stage error:', err)
		return { success: false, error: err.response?.data?.error || err.message }
	}
}

//* ---------------------------- Update Existing Stage ---------------------------- */
export async function apiUpdateStage(gameSlug, payload) {
	try {
		const data = await axiosClient.put(`/api/games/${gameSlug}/stages/${payload.stageSlug}/stage-update`, { payload })
		return { success: true, data }
	} catch (err) {
		isDev && console.error('Client update stage error:', err)
		return { success: false, error: err.response?.data?.error || err.message }
	}
}
