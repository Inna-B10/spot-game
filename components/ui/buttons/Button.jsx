import { Slot } from '@radix-ui/react-slot'
import cn from 'clsx'

export function Button({ children, variant = 'primary', asChild = false, ...props }) {
	const Comp = asChild ? Slot : 'button'

	return (
		<Comp
			className={cn('min-w-24 text-white text-center px-4 py-2 rounded w-fit h-fit disabled:bg-gray-600', {
				'bg-blue-600 hover:bg-blue-500': variant === 'primary',
				'bg-green-700 hover:bg-green-600': variant === 'secondary',
				'bg-amber-600 hover:bg-amber-500': variant === 'caution',
				'bg-red-700 hover:bg-red-600': variant === 'destructive',
				'bg-gray-700 hover:bg-gray-600': variant === 'simple',
			})}
			{...props}>
			{children}
		</Comp>
	)
}
