import fs from 'fs'
import path from 'path'
import { prisma } from './client.js'

async function importData() {
	try {
		console.log('📥 Importing data into database...')

		const backupDir = path.join(process.cwd(), 'backup')

		if (!fs.existsSync(backupDir)) {
			throw new Error('❌ Backup folder not found')
		}

		// 📁 Search for all data-YYYY-MM-DD.json files
		const files = fs
			.readdirSync(backupDir)
			.filter(file => /^backupDB-\d{4}-\d{2}-\d{2}\.json$/.test(file))
			.sort()
			.reverse() // the latest by date will be first

		if (files.length === 0) {
			throw new Error('❌ No backup files found in /backup')
		}

		const latestFile = files[0]
		const backupPath = path.join(backupDir, latestFile)
		console.log(`📂 Using latest backup: ${latestFile}`)

		const games = JSON.parse(fs.readFileSync(backupPath, 'utf8'))

		for (const game of games) {
			// Create game with preserved ID
			const createdGame = await prisma.games.create({
				data: {
					game_id: game.game_id, //preserve old ID
					game_title: game.game_title,
					game_slug: game.game_slug,
					game_desc: game.game_desc,
					createdAt: game.createdAt ? new Date(game.createdAt) : undefined,
				},
			})

			// Create related levels
			if (game.levels && game.levels.length > 0) {
				for (const level of game.levels) {
					await prisma.levels.create({
						data: {
							level_id: level.level_id, // preserve old ID
							game_id: createdGame.game_id,
							level_slug: level.level_slug,
							image_path: level.image_path,
							level_task: level.level_task ? level.level_task : null,
							difficulty: level.difficulty ? level.difficulty : null,
							areas: level.areas,
							createdAt: level.createdAt ? new Date(level.createdAt) : undefined,
						},
					})
				}
			}
		}

		console.log('✅ Data imported successfully! (IDs preserved)')

		// 🔧 Update Postgres sequences so autoincrement continues correctly
		console.log('🔄 Resetting PostgreSQL sequences...')
		await prisma.$executeRawUnsafe(`
			SELECT setval(
				pg_get_serial_sequence('"Games"', 'game_id'),
				COALESCE((SELECT MAX("game_id") FROM "Games"), 1),
				true
			);
		`)

		await prisma.$executeRawUnsafe(`
			SELECT setval(
				pg_get_serial_sequence('"Levels"', 'level_id'),
				COALESCE((SELECT MAX("level_id") FROM "Levels"), 1),
				true
			);
		`)

		console.log('✅ Sequences reset successfully!')
		console.log(`🎉 Import finished using ${latestFile}`)
	} catch (error) {
		console.error('❌ Error importing data:', error)
	} finally {
		await prisma.$disconnect()
	}
}

importData()
