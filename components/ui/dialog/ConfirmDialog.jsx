import { Button } from '@/components/ui/buttons/Button'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/dialog/confirm-dialog'
import { RotateCcw, Trash2 } from 'lucide-react'

export function ConfirmDialog({ label, title, msg = '', onConfirm, disabled = false }) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				{label === 'Delete' ? (
					<Button variant='destructive' aria-label={label} disabled={disabled}>
						<Trash2 className='inline-flex align-text-top mr-0.5' size={16} />
						{label}
					</Button>
				) : (
					<Button variant='caution' aria-label={label} disabled={disabled}>
						<RotateCcw className='inline-flex align-text-top mr-0.5' size={16} /> {label}
					</Button>
				)}
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription className={label === 'Delete' ? 'text-red-600' : ''}>{msg}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>
						<Button variant='simple' asChild>
							<span>Cancel</span>
						</Button>
					</AlertDialogCancel>
					<AlertDialogAction>
						<Button variant={label === 'Delete' ? 'destructive' : 'caution'} onClick={onConfirm} asChild>
							<span>{label}</span>
						</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
