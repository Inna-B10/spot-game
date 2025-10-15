import { LinkButton } from '@/components/ui/buttons/LinkButton'

export function BackNavLinks({ gameDB, modified }) {
	// Prevent navigation if there are unsaved changes
	const checkIfSaved = e => {
		if (modified) {
			const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave?')
			if (!confirmLeave) {
				e.preventDefault()
			}
		}
	}

	return (
		<>
			{/* //# ------------------------ Back to the list of levels for the current game */}
			<LinkButton
				href={`/editor/${gameDB.game_slug}`}
				role='button'
				onClick={checkIfSaved}
				aria-label={`Back to ${gameDB.game_title} index list`}
				title={`Back to ${gameDB.game_title} index list`}>
				Back to {gameDB.game_title}
			</LinkButton>

			{/* //# ------------------------ Back to the main Editor page */}
			<LinkButton href='/editor' role='button' onClick={checkIfSaved} aria-label='To Editor main page' title='To Editor main page'>
				Back to Editor
			</LinkButton>
			<LinkButton href='/' role='button' onClick={checkIfSaved} aria-label='To homepage' title='To homepage'>
				Back to Home
			</LinkButton>
		</>
	)
}
