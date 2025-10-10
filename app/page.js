import { LinkButton } from '@/components/ui/buttons/LinkButton'
import { GAMES } from '@/constants/games'

export default async function Home() {
	return (
		<div className='space-y-6'>
			<h1 className='text-2xl font-bold'>🏠 Home</h1>
			<ul className='mb-8'>
				<li>
					<LinkButton href='/editor' role='button' aria-label='Go to editor main page'>
						Level editor
					</LinkButton>
				</li>
			</ul>
			<h2 className='text-xl font-bold'>🎮 Choose game</h2>
			<ul className='inline-flex gap-2'>
				{GAMES.map(({ game, label }) => (
					<li key={game}>
						<LinkButton href={`/${game}`} role='button' aria-label={`Go to ${label} games list`}>
							{label}
						</LinkButton>
					</li>
				))}
			</ul>
		</div>
	)
}
