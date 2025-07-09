import fs from 'fs/promises'
import Link from 'next/link'
import path from 'path'

const games = [
	{ game: 'find-all', label: 'Найди всех' },
	{ game: 'differences', label: 'Найди отличия' },
]
export default async function Home() {
	const levelsByGame = {}

	for (const { game } of games) {
		const dataPath = path.join(process.cwd(), `data/${game}.json`)
		try {
			const file = await fs.readFile(dataPath, 'utf-8')
			levelsByGame[game] = JSON.parse(file)
		} catch (e) {
			console.error(`Ошибка чтения ${game}.json:`, e)
			levelsByGame[game] = []
		}
	}
	return (
		<main>
			<h1 className='text-2xl font-bold'>🏠 Главная страница</h1>
			<ul className='mb-4'>
				<li>
					<Link href='/editor'>Редактор уровней</Link>
				</li>
			</ul>
			<h2 className='text-xl font-bold'>🎮 Выберите игру и уровень</h2>

			{games.map(({ game, label }) => (
				<section key={game} className='space-y-4'>
					<h2 className='text-xl font-semibold'>{label}</h2>

					<ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
						{levelsByGame[game]?.map(level => (
							<li
								key={level.id}
								className='border p-4 rounded shadow hover:shadow-md space-y-2'>
								<p className='font-medium text-lg'>{level.id}</p>
								<Link
									href={`/game/${level.id}?game=${game}`}
									className='inline-block text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded'>
									Перейти к игре
								</Link>
							</li>
						))}
					</ul>
				</section>
			))}
		</main>
	)
}
