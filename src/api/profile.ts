import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { request } from './client'
import type { SaveProfileBody, TesterProfile } from './types'

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => request<TesterProfile>('/api/auth/profile'),
  })
}

export function useSaveProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: SaveProfileBody) =>
      request<TesterProfile>('/api/auth/profile', { method: 'PUT', body }),
    // The next tab to save builds its body from this, so it does not send back
    // what was there before this save
    onSuccess: (profile) => queryClient.setQueryData(['profile'], profile),
  })
}
