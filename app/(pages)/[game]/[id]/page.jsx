import PlayFind from '@/components/PlayFind'
import fs from 'fs/promises'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import path from 'path'

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
				<h1 className='text-xl font-bold mb-4'>Level: {level.id}</h1>
				{next && (
					<p>
						<Link href={`/game/image_${nextLevel}?game=${game}`}>Next</Link>
					</p>
				)}
			</div>
			<PlayFind level={level} game={game} />
		</>
	)
}
