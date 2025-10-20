import cn from 'clsx'

export function Button({ children, variant = 'primary', ...props }) {
	return (
		<button
			className={cn(' text-white px-4 py-2 rounded w-fit h-fit disabled:bg-gray-600 disabled:cursor-default', {
				'bg-blue-600 hover:bg-blue-700': variant === 'primary',
				'bg-green-600 hover:bg-green-700': variant === 'secondary',
			})}
			{...props}>
			{children}
		</button>
	)
}
