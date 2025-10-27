'use client'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog/dialog'
import { Button } from '../buttons/Button'

export function ConfirmDialog({ label, title = '', msg = '', onConfirm, disabled = 'false' }) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant='warn' disabled={disabled}>
					{label}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{msg}</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant='simple'>Cancel</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button variant='warn' onClick={onConfirm}>
							Delete
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
