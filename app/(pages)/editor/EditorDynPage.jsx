'use client'

import dynamic from 'next/dynamic'

const DynamicEditorContent = dynamic(
	() => import('./EditorContent').then(mod => mod.EditorContent),
	{ ssr: false }
)

export function EditorDynPage() {
	return <DynamicEditorContent />
}
