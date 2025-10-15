import { LinkButton } from '@/components/ui/buttons/LinkButton'
import { BLOB_URL } from '@/config/config'
import { prisma } from '@/lib/prisma/client'
import { getLevelsByGameSlug } from '@/services/server/levels'
import Image from 'next/image'
import Link from 'next/link'

export default async function GameIndex({ params }) {
	const { game } = await params

	if (!game) return notFound()

	//# ------------------------ Fetch game info (title and description)
	const gameDB = await prisma.games.findFirst({
		where: { game_slug: game },
		select: { game_title: true, game_desc: true },
	})

	//# ------------------------ If game not found — return 404
	if (!gameDB) return notFound()

	//# ------------------------ Fetch all levels for this game
	const levelsByGame = await getLevelsByGameSlug(game)

	if (!levelsByGame || levelsByGame.length === 0) {
		return (
			<div className='flex flex-col items-center gap-8'>
				<p>There are no levels for this game yet.</p>
				<LinkButton href='/' role='button' aria-label='Go to main page'>
					Back to Home
				</LinkButton>
			</div>
		)
	}

	//* -------------------------------- Rendering ------------------------------- */
	return (
		<section className='space-y-8 w-full'>
			{/* //# ------------------------ Game title and navigation */}
			<div className='flex justify-between items-center gap-2'>
				<h1 className='text-xl font-bold'>Game: {gameDB.game_title}</h1>
				<span className='space-x-4'>
					<LinkButton href='/editor' role='button' aria-label='Go to main editor page'>
						Back to Editor
					</LinkButton>
					<LinkButton href='/' role='button' aria-label='Go to homepage'>
						Back to Home
					</LinkButton>
				</span>
			</div>
			{/* //# ------------------------ Game description */}
			<p className='text-left'>
				<span className='font-semibold'>Description:</span> {gameDB.game_desc || 'No description provided.'}
			</p>
			{/* //# ------------------------ Add new level button */}
			<h2 className='text-lg font-semibold inline-block'>Choose level</h2>
			&nbsp; &nbsp;or&nbsp;&nbsp;&nbsp;
			<LinkButton href={`/editor/${game}/new`} className='inline-block text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded h-fit w-fit'>
				Create a new
			</LinkButton>
			{/* //# ------------------------ List of levels */}
			<ul className='flex flex-wrap gap-4'>
				{levelsByGame?.map(level => (
					<li key={level.level_id} className='border p-4 rounded shadow hover:shadow-md'>
						<Link href={`/editor/${game}/${level.level_slug}`} title={`open ${level.level_slug} to edit`}>
							{level.level_slug}
							{/* //# ------------------------ Show preview image from Blob storage */}
							<Image src={`${BLOB_URL}${level.image_path}`} alt={level.level_slug} width={100} height={100} className='w-fit h-fit object-contain' />
						</Link>
					</li>
				))}
			</ul>
		</section>
	)
}
