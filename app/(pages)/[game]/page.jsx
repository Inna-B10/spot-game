import { GAMES } from '@/constants/games'
import fs from 'fs/promises'
import Image from 'next/image'
import Link from 'next/link'
import path from 'path'
import { env } from 'process'

export const revalidate = 86400

export async function generateMetadata({ params }) {
	const { game } = await params

	if (!game) return {}

	const label = GAMES.find(g => g.game === game)?.label || 'Game'

	return {
		title: `Уровни игры ${label}`,
		description: `Список уровней для игры ${label}`,
	}
}

export async function generateStaticParams() {
	return GAMES.map(game => ({ game: game.game }))
}
export default async function GamePage({ params }) {
	const { game } = await params

	if (!game) return notFound()

	const label = GAMES.find(g => g.game === game)?.label || 'Game'
	let levelsByGame = []

	const dataPath = path.join(process.cwd(), `data/${game}.json`)

	try {
		const file = await fs.readFile(dataPath, 'utf-8')
		levelsByGame = JSON.parse(file)
	} catch (e) {
		if (env.NODE_ENV === 'development') {
			console.error(`Error reading ${game}.json:`, e)
		}
	}

	if (levelsByGame.length === 0) {
		return (
			<>
				<p>Уровней нет</p>
				<Link
					href='/'
					className='inline-block text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded h-fit'>
					На главную
				</Link>
			</>
		)
	}

	return (
		<section key={game} className='space-y-8 w-fit'>
			<h2 className='text-xl font-semibold'>{label}</h2>
			<ul className='flex flex-wrap gap-4'>
				{levelsByGame?.map(level => (
					<li
						key={level.id}
						className='border p-4 rounded shadow hover:shadow-md'>
						<Link href={`/game/${level.id}?game=${game}`} title={level.id}>
							{level.id}
							<Image
								src={`/images/${game}/${level.image}`}
								alt={level.id}
								width={100}
								height={100}
								className='w-fit h-fit object-contain'
							/>
						</Link>
					</li>
				))}
			</ul>
		</section>
	)
}
