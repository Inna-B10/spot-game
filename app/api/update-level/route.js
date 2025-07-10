import fs from 'fs/promises'
import { NextResponse } from 'next/server'
import path from 'path'

const dataDir = path.join(process.cwd(), 'data')

export async function GET(request) {
	const { searchParams } = new URL(request.url)
	const game = searchParams.get('game')
	const id = searchParams.get('id')

	if (!game || !id) {
		return NextResponse.json(
			{ error: 'Missing game or id param' },
			{ status: 400 }
		)
	}

	try {
		const filePath = path.join(dataDir, `${game}.json`)
		const file = await fs.readFile(filePath, 'utf-8')
		const levels = JSON.parse(file)
		const level = levels.find(l => l.id === id)

		if (!level) {
			return NextResponse.json({ error: 'Level not found' }, { status: 404 })
		}

		return NextResponse.json(level)
	} catch (e) {
		return NextResponse.json({ error: 'File read error' }, { status: 500 })
	}
}

export async function PUT(request) {
	const body = await request.json()
	const { game, id, updatedLevel } = body

	if (!game || !id || !updatedLevel) {
		return NextResponse.json(
			{ error: 'Missing required fields' },
			{ status: 400 }
		)
	}

	try {
		const filePath = path.join(dataDir, `${game}.json`)
		const file = await fs.readFile(filePath, 'utf-8')
		let levels = JSON.parse(file)

		const index = levels.findIndex(l => l.id === id)
		if (index === -1) {
			return NextResponse.json({ error: 'Level not found' }, { status: 404 })
		}

		levels[index] = updatedLevel
		await fs.writeFile(filePath, JSON.stringify(levels, null, 2))

		return NextResponse.json({ success: true })
	} catch (e) {
		return NextResponse.json({ error: 'File write error' }, { status: 500 })
	}
}
