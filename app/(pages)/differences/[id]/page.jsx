import PlayDifference from '@/components/PlayDifference'
import fs from 'fs/promises'
import { notFound } from 'next/navigation'
import path from 'path'

export default async function DifferencesLevelPage({ params }) {
	const { id } = await params

	const dataPath = path.join(process.cwd(), 'data/differences.json')
	let levels = []

	try {
		const file = await fs.readFile(dataPath, 'utf-8')
		levels = JSON.parse(file)
	} catch (e) {
		console.error('Error reading data:', e)
	}

	const level = levels.find(level => level.id === id)

	if (!level) return notFound()

	return (
		<main className='p-4'>
			<h1 className='text-xl font-bold mb-4'>Level: {level.id}</h1>
			<PlayDifference level={level} />
		</main>
	)
}
