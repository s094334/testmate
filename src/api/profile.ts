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
    onSuccess: (profile) => {
      // The next tab to save builds its body from this, so it does not send back
      // what was there before this save
      queryClient.setQueryData(['profile'], profile)
      // The header's name is display_name from the session, worked out on the
      // backend from the nickname and real name just saved
      queryClient.invalidateQueries({ queryKey: ['session'] })
    },
  })
}
