import { LinkButton } from '@/components/ui/buttons/LinkButton'
import { GAMES } from '@/constants/games'
import fs from 'fs/promises'
import Image from 'next/image'
import Link from 'next/link'
import path from 'path'
import { env } from 'process'

export default async function GameIndex({ params }) {
	const { game } = await params

	if (!game) return notFound()

	const label = GAMES.find(g => g.game === game)?.label || 'Game'
	let levelsByGame = []

	const dataPath = path.join(process.cwd(), `data/${game}.json`)

	try {
		const file = await fs.readFile(dataPath, 'utf-8')
		levelsByGame = JSON.parse(file)
	} catch (e) {
		if (env.NODE_ENV === 'development') {
			console.error(`Error reading ${game}.json:`, e)
		}
	}

	if (levelsByGame.length === 0) {
		return (
			<div className='flex flex-col items-center gap-8'>
				<p>There are no levels</p>
				<LinkButton href='/' role='button' aria-label='Go to main page'>
					Back to Home
				</LinkButton>
			</div>
		)
	}

	return (
		<section className='space-y-8 w-full'>
			<div className='flex justify-between items-center gap-2'>
				<h1 className='text-xl font-bold'>Game: {label}</h1>
				<span className='space-x-4'>
					<LinkButton href='/editor' role='button' aria-label='Go to main editor page'>
						Back to Editor
					</LinkButton>
					<LinkButton href='/' role='button' aria-label='Go to homepage'>
						Back to Home
					</LinkButton>
				</span>
			</div>
			<h2 className='text-lg font-semibold inline-block'>choose level</h2>
			&nbsp; &nbsp;or&nbsp;&nbsp;&nbsp;
			<LinkButton href={`/editor/${game}/new`} className='inline-block text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded h-fit w-fit'>
				Create a new
			</LinkButton>
			<ul className='flex flex-wrap gap-4'>
				{levelsByGame?.map(level => (
					<li key={level.id} className='border p-4 rounded shadow hover:shadow-md'>
						<Link href={`/editor/${game}/${level.id}`} title={`open ${level.id} to edit`}>
							{level.id}
							<Image src={`/images/${game}/${level.image}`} alt={level.id} width={100} height={100} className='w-fit h-fit object-contain' />
						</Link>
					</li>
				))}
			</ul>
		</section>
	)
}
