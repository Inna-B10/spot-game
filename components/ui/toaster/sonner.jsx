'use client'

import { CircleCheckIcon, OctagonXIcon, TriangleAlertIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Toaster as Sonner } from 'sonner'

const Toaster = (...props) => {
	const { theme = 'system' } = useTheme()

	return (
		<Sonner
			position='top-center'
			theme={theme}
			richColors={true}
			toastOptions={{
				classNames: {
					toast: '!text-base',
				},
			}}
			icons={{
				success: <CircleCheckIcon className='size-5' />,
				// info: <InfoIcon className='size-5' />,
				warning: <TriangleAlertIcon className='size-5' />,
				error: <OctagonXIcon className='size-5' />,
				// loading: <Loader2Icon className='size-5 animate-spin' />,
			}}
			{...props}
		/>
	)
}

export { Toaster }
