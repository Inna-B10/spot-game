'use client'

import dynamic from 'next/dynamic'

const DynamicEditorLevelContent = dynamic(
	() => import('./EditorLevelContent').then(mod => mod.EditorLevelContent),
	{ ssr: false }
)

export function EditorLevelDyn() {
	return <DynamicEditorLevelContent />
}
