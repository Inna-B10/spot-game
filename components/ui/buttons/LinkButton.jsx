import Link from 'next/link'

export function LinkButton({ children, ...props }) {
	return (
		<Link {...props} className=' min-w-24 inline-block text-white text-nowrap bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded h-fit w-fit'>
			{children}
		</Link>
	)
}
