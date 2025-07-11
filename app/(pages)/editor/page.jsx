import { NO_INDEX_PAGE } from '@/constants/seo.constants'
import { EditorDynPage } from './EditorDynPage'

export const metadata = {
	title: 'Editor | Home',
	...NO_INDEX_PAGE,
}
export default function EditorPage() {
	return <EditorDynPage />
}
