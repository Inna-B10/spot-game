import { GAMES } from '@/constants/games'
import fs from 'fs/promises'
import Image from 'next/image'
import Link from 'next/link'
import path from 'path'

export default async function GamePage({ params }) {
	const { game } = await params

	if (!game) return notFound()

	const label = GAMES.find(g => g.game === game)?.label
	let levelsByGame = []

	const dataPath = path.join(process.cwd(), `data/${game}.json`)

	try {
		const file = await fs.readFile(dataPath, 'utf-8')
		levelsByGame = JSON.parse(file)
	} catch (e) {
		console.error(`Error reading ${game}.json:`, e)
	}
	if (levelsByGame.length === 0) {
		return <p>Уровней нет</p>
	}
	return (
		<section key={game} className='space-y-8 w-fit'>
			<h2 className='text-xl font-semibold'>{label}</h2>
			<ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
				{levelsByGame?.map(level => (
					<li
						key={level.id}
						className='border p-4 rounded shadow hover:shadow-md space-y-2 flex justify-between gap-8'>
						<Link
							href={`/game/${level.id}?game=${game}`}
							className='inline-block text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded h-fit'>
							{level.id}
						</Link>
						<Image
							src={`/images/${game}/${level.image}`}
							alt={level.id}
							width={100}
							height={100}
							className='w-fit h-fit object-contain'
						/>
					</li>
				))}
			</ul>
		</section>
	)
}
