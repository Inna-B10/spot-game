'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
// import { XIcon } from 'lucide-react'
import cn from 'clsx'

export function Dialog({ ...props }) {
	return <DialogPrimitive.Root data-slot='dialog' {...props} />
}

export function DialogTrigger({ ...props }) {
	return <DialogPrimitive.Trigger data-slot='dialog-trigger' {...props} />
}

export function DialogContent({ className, ...props }) {
	return (
		<DialogPrimitive.Portal>
			<DialogPrimitive.Overlay className='fixed inset-0 bg-black/50' />
			<DialogPrimitive.Content className={cn('fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-4 shadow-lg', className)} {...props} />
		</DialogPrimitive.Portal>
	)
}

export function DialogHeader({ className, ...props }) {
	return <div className={cn('flex flex-col space-y-1', className)} {...props} />
}

export function DialogFooter({ className, ...props }) {
	return <div className={cn('flex justify-center space-x-2', className)} {...props} />
}

export function DialogTitle(props) {
	return <DialogPrimitive.Title className='text-lg font-semibold mb-8' {...props} />
}

export function DialogDescription(props) {
	return <DialogPrimitive.Description className='text-sm text-gray-500' {...props} />
}

export function DialogClose({ ...props }) {
	return <DialogPrimitive.Close data-slot='dialog-close' {...props} />
}
