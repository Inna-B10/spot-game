import { LinkButton } from '@/components/ui/buttons/LinkButton'
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
				<LinkButton href='/' role='button' aria-label='Go to main page'>
					На главную
				</LinkButton>
			</>
		)
	}

	return (
		<section key={game} className='space-y-8 w-full'>
			<div className='flex justify-between items-center gap-2'>
				<h2 className='text-xl font-semibold'>{label}</h2>
				<LinkButton href='/' role='button' aria-label='Go to homepage'>
					Back to Home
				</LinkButton>
			</div>
			<ul className='flex flex-wrap gap-4'>
				{levelsByGame?.map(level => (
					<li
						key={level.id}
						className='border p-4 rounded shadow hover:shadow-md'>
						<Link
							href={`/game/${level.id}?game=${game}`}
							title={`open level ${level.id}`}>
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
