import Link from 'next/link'

export function LinkButton({ children, ...props }) {
	return (
		<Link
			{...props}
			className='inline-block text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded h-fit w-fit'>
			{children}
		</Link>
	)
}
