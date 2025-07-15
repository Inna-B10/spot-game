import PlayFind from '@/components/PlayFind'
import { LinkButton } from '@/components/ui/buttons/LinkButton'
import { GAMES } from '@/constants/games'
import fs from 'fs/promises'
import { notFound } from 'next/navigation'
import path from 'path'

export const revalidate = 86400

export async function generateMetadata({ params, searchParams }) {
	const { id } = await params
	const { game } = await searchParams

	if (!id || !game) return {}

	return {
		title: `Игра ${game} | Уровень ${id}`,
		// description: `Описание уровня ${id} для игры ${game}`,
	}
}

export async function generateStaticParams() {
	const paths = []

	for (const { game } of GAMES) {
		try {
			const dataPath = path.join(process.cwd(), `data/${game}.json`)
			const file = await fs.readFile(dataPath, 'utf-8')
			const levels = JSON.parse(file)

			levels.forEach(level => {
				paths.push({
					game,
					id: level.id,
				})
			})
		} catch (e) {
			if (process.env.NODE_ENV === 'development') {
				console.error(`Ошибка чтения ${game}.json:`, e)
			}
		}
	}
	return paths
}

export default async function PlayFindPage({ params, searchParams }) {
	const { id } = await params
	const { game } = await searchParams

	if (!id || !game) return notFound()

	const dataPath = path.join(process.cwd(), `data/${game}.json`)

	let levels = []

	try {
		const file = await fs.readFile(dataPath, 'utf-8')
		levels = JSON.parse(file)
	} catch (e) {
		if (env.NODE_ENV === 'development') {
			console.error('Error reading data:', e)
		}
	}

	const level = levels.find(level => level.id === id)

	if (!level) return notFound()

	const nextLevel = parseInt(level.id.split('_')[1]) + 1
	const next = nextLevel <= levels.length

	return (
		<>
			<div className='flex justify-between items-center gap-16 mb-6'>
				<h1 className='text-xl font-bold'>Level: {level.id}</h1>
				<div className='flex items-center gap-4'>
					<LinkButton href='/' role='button' aria-label='Go to homepage'>
						Back to Home
					</LinkButton>
					<LinkButton
						href={`/${game}`}
						role='button'
						aria-label='Go to game levels'>
						Back to {GAMES.find(g => g.game === game)?.label || 'Game'}
					</LinkButton>
				</div>
				<div className='min-w-16'>
					{next && (
						<LinkButton
							href={`/game/image_${nextLevel}?game=${game}`}
							role='button'
							aria-label='Go to next level'>
							Next
						</LinkButton>
					)}
				</div>
			</div>
			<PlayFind level={level} game={game} />
		</>
	)
}
