'use client'

import Editor from '@/components/Editor'
import { NO_INDEX_PAGE } from '@/constants/seo.constants'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

export const metadata = {
	title: 'Editor Level',
	...NO_INDEX_PAGE,
}

function EditorLevelContent() {
	const searchParams = useSearchParams()
	const game = searchParams.get('game')
	const id = searchParams.get('id')

	const [initialLevel, setInitialLevel] = useState(null)
	const [status, setStatus] = useState('')
	const [modified, setModified] = useState(false)

	const router = useRouter()

	const goBack = () => {
		if (modified) {
			if (window.confirm('Do you want to leave without saving?')) {
				router.push('/editor')
			}
		} else {
			router.push('/editor')
		}
	}

	useEffect(() => {
		if (!game || !id) return

		async function loadLevel() {
			setStatus('Загрузка уровня...')
			try {
				const res = await fetch(`/api/get-level?game=${game}&id=${id}`)
				const data = await res.json()

				if (data?.error) {
					setStatus('Ошибка: ' + data.error)
				} else {
					setInitialLevel(data)
					setStatus('')
				}
			} catch (e) {
				setStatus('Ошибка загрузки уровня')
			}
		}

		loadLevel()
	}, [game, id])

	return (
		<>
			<div className='flex justify-between items-center gap-8 mb-6'>
				<div>
					{game && id ? (
						<>
							<h1 className='text-2xl font-bold'>Editing</h1>
							<p>
								game:
								<span className='font-semibold text-blue-600'>{game}</span>,
								level:
								<span className='font-semibold text-blue-600'>{id}</span>
							</p>
						</>
					) : (
						<h1 className='text-2xl font-bold'>Create new level</h1>
					)}
				</div>
				<button
					onClick={goBack}
					className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700'>
					Back to Editor Home
				</button>
			</div>

			{status && <p className='text-gray-600 text-sm'>{status}</p>}

			<Editor
				initialLevel={initialLevel}
				mode={game && id ? 'edit' : 'create'}
				game={game || ''}
				setModified={setModified}
			/>
		</>
	)
}

export default function EditorLevelPage() {
	return (
		<Suspense fallback={<div>Loading editor...</div>}>
			<EditorLevelContent />
		</Suspense>
	)
}
