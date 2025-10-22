'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function Providers({ children }) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						retry: 1,
						refetchOnWindowFocus: false,
					},
					mutations: {
						retry: 1,
					},
				},
			})
	)

	return (
		<QueryClientProvider client={queryClient}>
			{/* <LazyMotion features={domAnimation}> */}
			{children}
			{/* <Toaster
						toastOptions={{
							style: {
								backgroundColor: '#3f3f46',
								// backgroundColor: '#202937',
								color: 'white',
							},
							className: 'border border-white/20  shadow-lg',
						}}
					/> */}
			{/* </LazyMotion> */}
		</QueryClientProvider>
	)
}
