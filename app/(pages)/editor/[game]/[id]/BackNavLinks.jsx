import { LinkButton } from '@/components/ui/buttons/LinkButton'
import { GAMES } from '@/constants/games'

export function BackNavLinks({ game, modified }) {
	const checkIfSaved = e => {
		if (modified) {
			const confirmLeave = window.confirm(
				'You have unsaved changes. Are you sure you want to leave?'
			)
			if (!confirmLeave) {
				e.preventDefault()
			}
		}
	}
	return (
		<>
			<LinkButton
				href={`/editor/${game}`}
				role='button'
				onClick={checkIfSaved}
				aria-label={`Go to ${game} index list`}
				title={`Go to ${game} index list`}>
				Back to {GAMES.find(g => g.game === game)?.label}
			</LinkButton>
			<LinkButton
				href='/editor'
				role='button'
				onClick={checkIfSaved}
				aria-label='Go to main editor page'
				title='Go to main Editor page'>
				Back to Editor
			</LinkButton>
			<LinkButton
				href='/'
				role='button'
				onClick={checkIfSaved}
				aria-label='Go to homepage'
				title='Go to homepage'>
				Back to Home
			</LinkButton>
		</>
	)
}
