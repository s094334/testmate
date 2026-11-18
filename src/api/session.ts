import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { ApiError, request } from './client'
import type { User } from './types'

// Who is logged in, from GET /api/auth/session.
//   data === undefined  still asking
//   data === null       visitor (the API answered 401)
//   data is a User      logged in
// Every component that calls this shares one request and one answer.
// Signup, login and logout update the ['session'] entry themselves.
export function useSession() {
  return useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      try {
        return await request<User>('/api/auth/session')
      } catch (error) {
        // For this API, 401 is not a failure: it means "not logged in"
        if (error instanceof ApiError && error.status === 401) {
          return null
        }
        throw error
      }
    },
    // Ask again at most every 5 minutes when a page or header mounts;
    // switching back to the browser tab after that checks it again
    staleTime: 5 * 60 * 1000,
  })
}

export function useLogout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => request<void>('/api/auth/logout', { method: 'POST' }),
    onSuccess: () => {
      // Drop every saved answer, so nothing of this person stays on the page
      queryClient.clear()
      queryClient.setQueryData(['session'], null)
      navigate('/')
    },
  })
}
