'use client'
import dynamic from 'next/dynamic'

const DynamicEditableDescription = dynamic(() => import('@/components/editor/EditableDescription'), {
	ssr: false,
	loading: () => <p>Loading editor...</p>,
})

export function EditableDescriptionDyn({ initialDesc, gameSlug }) {
	return <DynamicEditableDescription initialDesc={initialDesc} gameSlug={gameSlug} />
}
