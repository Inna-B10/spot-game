import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { GAME_DESC } from '../../constants/gameDescriptions.js'
import { GAMES } from '../../constants/games.js'
import { prisma } from './client.js'

// Paths setup
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataDir = path.join(__dirname, '../../data')

// Utility for reading JSON
const loadJson = fileName => JSON.parse(fs.readFileSync(path.join(dataDir, fileName), 'utf8'))

async function seedGames() {
	console.log('🌱 Seeding Games...')

	for (const game of GAMES) {
		const desc = GAME_DESC.find(g => g.game === game.game)?.description || null

		const existing = await prisma.games.findFirst({
			where: { game_title: game.label },
		})

		if (existing) {
			console.log(`⚠️ Game "${game.label}" already exists, skipping`)
			continue
		}

		await prisma.games.create({
			data: {
				game_title: game.label,
				game_desc: desc,
			},
		})
	}

	console.log('✅ Games seeded successfully!\n')
}

async function seedLevels() {
	console.log('🌱 Seeding Levels...')

	// Map JSON files to game slugs
	const files = [
		{ file: 'find-all.json', slug: 'find-all' },
		{ file: 'find-differences.json', slug: 'find-differences' },
		{ file: 'find-odd.json', slug: 'find-odd' },
		{ file: 'find-pair.json', slug: 'find-pair' },
	]

	for (const { file, slug } of files) {
		const data = loadJson(file)
		const gameTitle = GAMES.find(g => g.game === slug)?.label

		const game = await prisma.games.findFirst({
			where: { game_title: gameTitle },
		})

		if (!game) {
			console.warn(`⚠️ No game found for ${slug}, skipping`)
			continue
		}

		console.log(`🕹️ Inserting levels for ${slug}...`)

		for (const item of data) {
			await prisma.levels.create({
				data: {
					game_id: game.game_id,
					image_name: item.image,
					image_path: `/images/${slug}/${item.image}`, // temporary until blob upload
					difficulty: null,
					areas: item.areas, // JSON object
				},
			})
		}

		console.log(`✅ ${slug} levels inserted`)
	}

	console.log('\n🎉 All levels seeded!')
}

async function main() {
	await seedGames()
	await seedLevels()
}

main()
	.catch(e => {
		console.error('❌ Seeding failed:', e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
