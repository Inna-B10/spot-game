import clsx from 'clsx'

export function Button({ children, variant = 'primary', ...props }) {
	return (
		<button
			className={clsx(' text-white px-4 py-2 rounded w-fit', {
				'bg-blue-600 hover:bg-blue-700': variant === 'primary',
				'bg-green-600 hover:bg-green-700': variant === 'secondary',
			})}
			{...props}>
			{children}
		</button>
	)
}
