import fs from 'fs'
import path from 'path'
import { prisma } from './client.js'

async function exportData() {
	try {
		console.log('📤 Exporting data from database...')

		// Get all games with their levels
		const games = await prisma.games.findMany({
			include: {
				levels: true,
			},
		})

		const backupDir = path.join(process.cwd(), 'backup')
		if (!fs.existsSync(backupDir)) {
			fs.mkdirSync(backupDir)
		}

		// 🗓️ Generate a file name based on the current date
		const today = new Date()
		const dateStr = today.toISOString().split('T')[0] // YYYY-MM-DD
		const fileName = `backupDB-${dateStr}.json`

		const backupPath = path.join(backupDir, fileName)
		fs.writeFileSync(backupPath, JSON.stringify(games, null, 2), 'utf8')

		console.log(`✅ Data exported successfully to ${backupPath}`)
	} catch (error) {
		console.error('❌ Error exporting data:', error)
	} finally {
		await prisma.$disconnect()
	}
}

exportData()
