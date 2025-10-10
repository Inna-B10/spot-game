import { LinkButton } from '@/components/ui/buttons/LinkButton'
import { GAMES } from '@/constants/games'
import { NO_INDEX_PAGE } from '@/constants/seo.constants'

export const metadata = {
	title: 'Editor | Home',
	...NO_INDEX_PAGE,
}
export default function EditorPage() {
	return (
		<>
			<div className='flex justify-between items-center gap-2 mb-4'>
				<h1 className='text-2xl font-semibold'>Choose game</h1>
				<LinkButton href='/' role='button' aria-label='Go to homepage'>
					Back to Home
				</LinkButton>
			</div>
			<ul className='inline-flex gap-2'>
				{GAMES.map(({ game, label }) => (
					<li key={game}>
						<LinkButton href={`/editor/${game}`} role='button' aria-label={`Go to ${label} games list`}>
							{label}
						</LinkButton>
					</li>
				))}
			</ul>
		</>
	)
}
