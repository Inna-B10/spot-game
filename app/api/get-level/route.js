import fs from 'fs/promises'
import { NextResponse } from 'next/server'
import path from 'path'

const dataDir = path.join(process.cwd(), 'data')

export async function GET(request) {
	const { searchParams } = new URL(request.url)
	const game = searchParams.get('game')
	const id = searchParams.get('id')

	if (!game || !id) {
		console.error('Missing game or id param')
		return NextResponse.json({ error: 'Missing game or id param' }, { status: 400 })
	}

	try {
		const filePath = path.join(dataDir, `${game}.json`)
		const file = await fs.readFile(filePath, 'utf-8')
		const levels = JSON.parse(file)

		if (id === '_all') {
			// return the entire array of levels
			return NextResponse.json(levels)
		}

		const level = levels.find(l => l.id === id)

		if (!level) {
			return NextResponse.json({ error: 'Level not found' }, { status: 404 })
		}

		return NextResponse.json(level)
	} catch (e) {
		return NextResponse.json({ error: 'File read error' }, { status: 500 })
	}
}
