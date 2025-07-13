import { NO_INDEX_PAGE } from '@/constants/seo.constants'
import { EditorLevelDyn } from './EditorLevelDyn'

export const metadata = {
	title: 'Editor Level',
	...NO_INDEX_PAGE,
}

export default function EditorLevelPage() {
	return <EditorLevelDyn />
}
