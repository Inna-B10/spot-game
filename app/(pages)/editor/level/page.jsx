import { NO_INDEX_PAGE } from '@/constants/seo.constants'
import { EditorLevelDyn } from './EditorLevelDyn'
// import { Suspense } from 'react'

export const metadata = {
	title: 'Editor Level',
	...NO_INDEX_PAGE,
}

export default function EditorLevelPage() {
	return (
		// <Suspense fallback={<div>Loading editor...</div>}>
		<EditorLevelDyn />
		// </Suspense>
	)
}
