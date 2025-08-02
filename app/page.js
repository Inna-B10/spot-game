import { LinkButton } from '@/components/ui/buttons/LinkButton'
import { GAMES } from '@/constants/games'

export default async function Home() {
	return (
		<div className='space-y-6'>
			<h1 className='text-2xl font-bold'>🏠 Главная страница</h1>
			<ul className='mb-8'>
				<li>
					<LinkButton
						href='/editor'
						role='button'
						aria-label='Go to editor page'>
						Редактор уровней
					</LinkButton>
				</li>
			</ul>
			<h2 className='text-xl font-bold'>🎮 Выберите игру</h2>
			<ul className='inline-flex gap-2'>
				{GAMES.map(({ game, label }) => (
					<li key={game}>
						<LinkButton
							href={`/${game}`}
							role='button'
							aria-label={`Go to ${label} games list`}>
							{label}
						</LinkButton>
					</li>
				))}
			</ul>
		</div>
	)
}
