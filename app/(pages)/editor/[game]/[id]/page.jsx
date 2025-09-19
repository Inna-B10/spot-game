import Editor from '@/components/Editor'
import fs from 'fs/promises'
import { notFound } from 'next/navigation'
import path from 'path'
import { env } from 'process'

export default async function EditLevel({ params }) {
	const { game, id } = await params

	if (!id || !game) return notFound()

	const mode = id === 'new' ? 'create' : 'edit'
	let level

	if (mode === 'create') {
		// For creating a new level, we can initialize an empty level object
		level = {
			id: '',
			imageUrl: '',
			areas: [],
		}
	} else {
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

		level = levels.find(level => level.id === id)

		if (!level) return notFound()
	}

	return <Editor initialLevel={level} mode={mode} game={game} />
}
