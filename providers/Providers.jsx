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

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
