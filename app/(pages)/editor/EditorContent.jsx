import { GAMES } from '@/constants/games'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function EditorContent() {
	const [game, setGame] = useState('')
	const [levelId, setLevelId] = useState('')
	const [availableLevels, setAvailableLevels] = useState([])
	const router = useRouter()

	useEffect(() => {
		if (game) {
			async function fetchLevels() {
				try {
					const res = await fetch(`/api/get-level?game=${game}&id=_all`)
					const data = await res.json()
					if (Array.isArray(data)) setAvailableLevels(data.map(l => l.id))
				} catch (e) {
					console.warn('Error loading level(s)', e)
				}
			}
			fetchLevels()
		}
	}, [game])

	function handleEdit() {
		if (!game || !levelId) {
			let message = 'Fill in all fields!'
			if (!game) message += '\nMissing game'
			if (!levelId) message += '\nMissing level ID'
			alert(message)
			return
		}
		router.push(`/editor/level?game=${game}&id=${levelId}`)
	}

	function handleCreate() {
		router.push('/editor/level')
	}

	return (
		<>
			<h1 className='text-2xl font-bold text-center'>Level editor</h1>

			<div className='space-y-6 flex flex-col'>
				<button
					onClick={handleCreate}
					className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-fit'>
					Create new
				</button>
				<p>or</p>
				<div className='space-y-4'>
					<h2 className='text-xl font-semibold'>Load existing level</h2>
					<div className='w-fit'>
						<label className='mr-2 font-medium'>Game:</label>
						<select
							value={game}
							onChange={e => setGame(e.target.value)}
							className='border px-2 py-1 rounded'>
							<option value=''>Select game</option>
							{GAMES.map(g => (
								<option key={g.game} value={g.game}>
									{g.label}
								</option>
							))}
						</select>
					</div>
					<div>
						<label className='mr-2 font-medium'>ID level:</label>
						<input
							value={levelId}
							onChange={e => setLevelId(e.target.value)}
							list='level-list'
							className='border px-2 py-1 rounded w-30'
						/>
						<datalist id='level-list'>
							{availableLevels.map(id => (
								<option key={id} value={id} />
							))}
						</datalist>
					</div>
					<button
						onClick={handleEdit}
						className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
						Edit
					</button>
				</div>
			</div>
		</>
	)
}
