import PlayLevel from '@/components/PlayLevel'
import fs from 'fs/promises'
import { notFound } from 'next/navigation'
import path from 'path'

export default async function GameLevelPage({ params }) {
	const { id } = params

	const dataPath = path.join(process.cwd(), 'data/differences.json')
	let levels = []

	try {
		const file = await fs.readFile(dataPath, 'utf-8')
		levels = JSON.parse(file)
	} catch (e) {
		console.error('Ошибка чтения данных:', e)
	}

	const level = levels.find(level => level.id === id)

	if (!level) return notFound()

	return (
		<main className='p-4'>
			<h1 className='text-xl font-bold mb-4'>Уровень: {level.id}</h1>
			<PlayLevel level={level} />
		</main>
	)
}
