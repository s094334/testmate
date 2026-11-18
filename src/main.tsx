import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApiError } from '@/api/client'
import './index.css'
import App from './App.tsx'

function goToLoginIfLoggedOut(error: Error) {
  if (error instanceof ApiError && error.code === 'UNAUTHENTICATED') {
    window.location.assign('/login')
  }
}

const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: goToLoginIfLoggedOut }),
  mutationCache: new MutationCache({ onError: goToLoginIfLoggedOut }),
  defaultOptions: {
    queries: {
      // Asking again will not change a 4xx (not logged in, no permission…);
      // only network and server errors are retried, up to 3 times
      retry: (failureCount, error) =>
        !(error instanceof ApiError && error.status < 500) && failureCount < 3,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
)
