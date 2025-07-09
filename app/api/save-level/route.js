import fs from 'fs'
import { writeFile } from 'fs/promises'
import { NextResponse } from 'next/server'
import path from 'path'
import { v4 as uuid } from 'uuid'

export async function POST(req) {
	try {
		const formData = await req.formData()

		let id
		const file = formData.get('file')
		const differences = formData.get('differences')
		const name = formData.get('name')?.trim()

		if (!file || !differences || !name) {
			return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
		}

		// Get the file extension
		const ext = file.name.split('.').pop()
		const uniqueName = `${name.replace(/\s/g, '_')}_${uuid().slice(
			0,
			6
		)}.${ext}`
		const filePath = path.join(
			process.cwd(),
			'public/images/differences',
			uniqueName
		)

		// Save the image
		const buffer = Buffer.from(await file.arrayBuffer())
		await writeFile(filePath, buffer)

		// Path to JSON with levels
		const jsonPath = path.join(process.cwd(), 'data/differences.json')
		console.log(jsonPath)

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

		const parsedDiffs = JSON.parse(differences)

		existing.push({
			id,
			image: uniqueName,
			differences: parsedDiffs,
		})

		fs.writeFileSync(jsonPath, JSON.stringify(existing, null, 2), 'utf-8')

		return NextResponse.json({ success: true, file: uniqueName })
	} catch (error) {
		console.error('Save error:', error)
		return NextResponse.json({ error: 'Server error' }, { status: 500 })
	}
}
