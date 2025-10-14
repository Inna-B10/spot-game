import { prisma } from './client.js'

async function main() {
	const games = await prisma.games.findMany()

	for (const game of games) {
		const slug = game.game_title.toLowerCase().replace(/\s+/g, '-')
		await prisma.games.update({
			where: { game_id: game.game_id },
			data: { game_slug: slug },
		})
	}

	const levels = await prisma.levels.findMany({
		include: { games: true },
	})
	for (const level of levels) {
		const levelSlug = `image-${level.level_id}`
		await prisma.levels.update({
			where: { level_id: level.level_id },
			data: { level_slug: levelSlug },
		})
	}

	console.log('✅ Slugs updated')
}

main()
	.catch(e => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
