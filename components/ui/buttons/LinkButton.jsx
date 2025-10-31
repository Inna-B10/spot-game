import cn from 'clsx'
import Link from 'next/link'
export function LinkButton({ children, className, ...props }) {
	return (
		<Link {...props} className={cn('min-w-24 inline-block text-white text-center text-nowrap bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded h-fit w-fit', className)}>
			{children}
		</Link>
	)
}
