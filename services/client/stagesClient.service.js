import { axiosClient } from '@/lib/utils/axiosClient'
import { isDev } from '@/lib/utils/isDev'
import axios from 'axios'

//* ---------------------------- Create New Stage ---------------------------- */
export async function apiCreateStage(gameSlug, formData) {
	try {
		if (!gameSlug || !formData) throw new Error('Missing required params.')

		const { data } = await axios.post(`/api/games/${gameSlug}/stages/stage-create-new`, formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		})

		if (data?.success) {
			return data.payload
		} else {
			throw new Error(data?.error || 'Failed to create new stage.')
		}
	} catch (err) {
		isDev && console.error('Client create stage error:', err.response?.data?.error, err)

		throw new Error(err.response?.data?.error || err.message)
	}
}

//* ---------------------------- Update Existing Stage ---------------------------- */
export async function apiUpdateStage(gameSlug, updatedStage) {
	try {
		if (!gameSlug || !updatedStage) throw new Error('Missing required params.')

		const { data } = await axiosClient.put(`/api/games/${gameSlug}/stages/${updatedStage.stageSlug}/stage-update`, { updatedStage })

		if (data?.success) {
			return
		} else {
			throw new Error(data?.error || 'Failed to update stage.')
		}
	} catch (err) {
		isDev && console.error('Client update stage error:', err.response?.data?.error, err)

		throw new Error(err.response?.data?.error || err.message)
	}
}

//* --------------------------- Delete Stage By Slug ----------------------------- */
export async function apiDeleteStageBySlug(gameSlug, stageSlug) {
	try {
		if (!stageSlug || !gameSlug) throw new Error('Missing required params.')

		const { data } = await axiosClient.delete(`/api/games/${gameSlug}/stages/${stageSlug}/stage-delete`)

		if (data?.success) {
			return
		} else {
			throw new Error(data?.error || 'Failed to delete stage.')
		}
	} catch (err) {
		isDev && console.error('Client delete stage error:', err.response?.data?.error, err)

		throw new Error(err.response?.data?.error || err.message)
	}
}
