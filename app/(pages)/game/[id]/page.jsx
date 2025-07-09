import PlayDifference from '@/components/PlayDifference'
import fs from 'fs/promises'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import path from 'path'

export default async function GameFindPage({ params, searchParams }) {
	const { id } = await params
	const { game } = await searchParams

	if (!id || !game) return notFound()

	const dataPath = path.join(process.cwd(), `data/${game}.json`)

	let objects = []

	try {
		const file = await fs.readFile(dataPath, 'utf-8')
		objects = JSON.parse(file)
	} catch (e) {
		console.error('Error reading data:', e)
	}

	const object = objects.find(object => object.id === id)

	if (!object) return notFound()

	const nextObject = parseInt(object.id.split('_')[1]) + 1
	const next = nextObject <= objects.length

	return (
		<main className='p-4'>
			<div className='flex justify-between items-center gap-16 mb-6'>
				<h1 className='text-xl font-bold mb-4'>Level: {object.id}</h1>
				{next && (
					<p>
						<Link href={`/game/image_${nextObject}?game=${game}`}>Next</Link>
					</p>
				)}
			</div>
			<PlayDifference object={object} game={game} />
		</main>
	)
}
