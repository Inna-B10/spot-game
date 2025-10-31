/**
 * Universal helper for safely updating cached lists in React Query.
 *
 * Handles both shapes:
 * - Array cache: [item, item, ...]
 * - Object cache: { data: [item, item, ...] }
 *
 * Supported actions:
 * - 'add' → append item
 * - 'remove' → remove by id or slug
 * - 'update' → replace existing item by id or slug
 */

export function updateCachedList(queryClient, queryKey, newItem, action = 'add') {
	queryClient.setQueryData(queryKey, old => {
		if (!old) {
			if (action === 'add') return [newItem]
			return old
		}

		// get list reference regardless of shape
		const list = Array.isArray(old.data) ? old.data : Array.isArray(old) ? old : null
		if (!list) return old // fallback: unexpected shape

		let updatedList = list

		switch (action) {
			case 'add':
				updatedList = [...list, newItem]
				break

			case 'remove':
				updatedList = list.filter(item => item.game_slug !== newItem.game_slug)
				break

			case 'update':
				updatedList = list.map(item => (item.game_id === newItem.game_id || item.game_slug === newItem.game_slug ? newItem : item))
				break

			default:
				return old
		}

		// return in same shape
		return Array.isArray(old.data) ? { ...old, data: updatedList } : updatedList
	})
}
