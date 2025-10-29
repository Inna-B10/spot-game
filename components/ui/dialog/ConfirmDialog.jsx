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

export function ConfirmDialog({ label, title, msg = '', onConfirm, disabled = 'false' }) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant={label === 'Delete' ? 'destructive' : 'caution'} disabled={disabled}>
					{label}
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{msg}</AlertDialogDescription>
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
