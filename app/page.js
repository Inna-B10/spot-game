import { GAMES } from '@/constants/games'
import Link from 'next/link'

export default async function Home() {
	return (
		<main>
			<h1 className='text-2xl font-bold'>🏠 Главная страница</h1>
			<ul className='mb-4'>
				<li>
					<Link
						href='/editor'
						className='inline-block text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded h-fit'>
						Редактор уровней
					</Link>
				</li>
			</ul>
			<h2 className='text-xl font-bold'>🎮 Выберите игру</h2>
			<ul className='inline-flex gap-2'>
				{GAMES.map(({ game, label }) => (
					<li key={game}>
						<Link
							href={`/${game}`}
							className='inline-block text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded h-fit'>
							{label}
						</Link>
					</li>
				))}
			</ul>
		</main>
	)
}
