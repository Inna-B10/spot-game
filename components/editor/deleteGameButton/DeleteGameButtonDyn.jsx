'use client'
import dynamic from 'next/dynamic'

const DynamicDeleteGameButton = dynamic(() => import('@/components/editor/deleteGameButton/DeleteGameButton'), {
	ssr: false,
	loading: () => <p>Loading editor...</p>,
})

export function DeleteGameButtonDyn({ gameSlug }) {
	return <DynamicDeleteGameButton gameSlug={gameSlug} />
}
