import { ConfirmDialog } from '@/components/ui/dialog/ConfirmDialog'
import { isDev } from '@/lib/utils/isDev'
import { updateCachedList } from '@/lib/utils/reactQueryHelpers'
import { apiDeleteGameBySlug } from '@/services/client/gamesClient.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function DeleteGameButton({ gameSlug }) {
	const router = useRouter()
	const queryClient = useQueryClient()

	const alertTitle = 'Are you shure you want to delete this game?'
	const alertMsg = 'All stages in this game will be deleted as well.'

	const { mutate: deleteGame, isPending } = useMutation({
		mutationKey: ['delete-game'],
		mutationFn: () => apiDeleteGameBySlug(gameSlug),
		onSuccess: () => {
			toast.success('Game deleted successfully!')

			window.location.href = '/editor' //no option to go back

			// instantly remove deleted game from cached list
			updateCachedList(queryClient, ['get-all-games'], { game_slug: gameSlug }, 'remove')
			queryClient.invalidateQueries({ queryKey: ['get-all-games'] })

			router.refresh('/')
		},
		onError: err => {
			toast.error('Error: ' + (err.message || 'Failed to delete game.'))
			isDev && console.error('Delete game mutation error:', err)
		},
	})

	return (
		<>
			<ConfirmDialog label='Delete' title={alertTitle} msg={alertMsg} onConfirm={deleteGame} disabled={isPending} />
		</>
	)
}
