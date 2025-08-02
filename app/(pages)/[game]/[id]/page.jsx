import PlayGameFind from '@/components/PlayGameFind'
import { LinkButton } from '@/components/ui/buttons/LinkButton'
import { GAME_DESC } from '@/constants/gameDescriptions'
import { GAMES } from '@/constants/games'
import clsx from 'clsx'
import fs from 'fs/promises'
import { notFound } from 'next/navigation'
import path from 'path'
import { env } from 'process'

export const revalidate = 86400

export async function generateMetadata({ params }) {
	const { game, id } = await params

	if (!id || !game) return {}
	const description = GAME_DESC.find(g => g.game === game)?.description

	return {
		title: `Game ${game} | Level ${id}`,
		description: `${description} | Level ${id}`,
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

export default async function PlayFindPage({ params }) {
	const { game, id } = await params

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

	const description = GAME_DESC.find(g => g.game === game)?.description
	const nextLevel = parseInt(level.id.split('_')[1]) + 1
	const isNext = nextLevel <= levels.length

	return (
		<>
			<div className='flex justify-center items-center gap-4 mb-10'>
				<LinkButton href='/' role='button' aria-label='Go to homepage'>
					Choose another game
				</LinkButton>
				<LinkButton
					href={`/${game}`}
					role='button'
					aria-label='Go to game levels'>
					Choose another level
				</LinkButton>
			</div>
			<div
				className={clsx(
					'flex flex-col justify-between items-center gap-2 mb-6 lg:flex-row bg-bg rounded',
					isNext ? 'p-2' : 'py-4 px-2'
				)}>
				<div className='flex gap-8 justify-center'>
					<p>
						<span className='font-semibold text-blue-500'>Game:</span> {game}
					</p>
					<p>
						<span className='font-semibold text-blue-500'>Level:</span>{' '}
						{level.id}
					</p>
				</div>
				<div>
					<span className='font-semibold text-blue-500'>Description:</span>{' '}
					{description}
				</div>
				<div className='min-w-16 mt-2 lg:mt-0'>
					{isNext && (
						<LinkButton
							href={`/${game}/image_${nextLevel}`}
							role='button'
							aria-label='Go to next level'>
							Next
						</LinkButton>
					)}
				</div>
			</div>
			<PlayGameFind level={level} game={game} />
		</>
	)
}
