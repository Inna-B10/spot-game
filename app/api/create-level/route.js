import fs from 'fs'
import { writeFile } from 'fs/promises'
import { NextResponse } from 'next/server'
import path from 'path'
import { v4 as uuid } from 'uuid'

export async function POST(req) {
	const game = req.nextUrl.searchParams.get('game')

	try {
		const formData = await req.formData()

		let id
		const file = formData.get('file')
		const points = formData.get('points')
		const name = formData.get('name')?.trim()

		if (!file || !points || !name) {
			return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
		}

		// Path to JSON with levels
		const jsonPath = path.join(process.cwd(), `data/${game}.json`)

		let existing = []
		if (fs.existsSync(jsonPath)) {
			try {
				existing = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
				const baseId = name
					.replace(/\s+/g, '_')
					.replace(/\.[^.]+$/, '')
					.toLowerCase()
				id = `${baseId}_${existing.length + 1}`
			} catch (e) {
				id = `${name}_1`
				existing = []
			}
		}

		// Get the file extension
		const ext = file.name.split('.').pop()
		const uniqueName = `${id.replace(/\s/g, '_')}_${uuid().slice(0, 6)}.${ext}`
		const filePath = path.join(
			process.cwd(),
			`public/images/${game}`,
			uniqueName
		)
		// Save the image
		const buffer = Buffer.from(await file.arrayBuffer())
		await writeFile(filePath, buffer)

		const parsedDiffs = JSON.parse(points)

		existing.push({
			id,
			image: uniqueName,
			points: parsedDiffs,
		})

		fs.writeFileSync(jsonPath, JSON.stringify(existing, null, 2), 'utf-8')

		return NextResponse.json({ success: true, file: uniqueName, id: id })
	} catch (error) {
		if (env.NODE_ENV === 'development') {
			console.error('Save error:', error)
		}
		return NextResponse.json({ error: 'Server error' }, { status: 500 })
	}
}
