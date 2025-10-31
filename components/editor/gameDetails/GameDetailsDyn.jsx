'use client'
import dynamic from 'next/dynamic'

const DynamicGameDetails = dynamic(() => import('@/components/editor/gameDetails/GameDetails'), {
	ssr: false,
	loading: () => <p>Loading editor...</p>,
})

export function GameDetailsDyn({ initialGame }) {
	return <DynamicGameDetails initialGame={initialGame} />
}
