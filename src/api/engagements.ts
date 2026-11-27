import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { request } from './client'
import type { Engagement, EngagementSummary, Nda } from './types'

export function useEngagements() {
  return useQuery({
    queryKey: ['engagements', 'list'],
    queryFn: () => request<{ items: EngagementSummary[] }>('/api/engagements'),
  })
}

export function useEngagement(id: string) {
  return useQuery({
    queryKey: ['engagements', id],
    queryFn: () => request<Engagement>(`/api/engagements/${id}`),
  })
}

export function useNda(id: string) {
  return useQuery({
    queryKey: ['engagements', id, 'nda'],
    queryFn: () => request<Nda>(`/api/engagements/${id}/nda`),
  })
}

export function useSignNda(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      request<Engagement>(`/api/engagements/${id}/sign-nda`, {
        method: 'POST',
      }),
    // Returns the refetch, so the mutation stays pending until the
    // engagement, the list and the nda have all been read again.
    // ['engagements'] covers all three
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['engagements'] }),
    // Any failure, not only a 409: a reply lost on the way may still have
    // signed. Returns the refetch, so the page sees the engagement as it is
    // now by the time the mutation fails
    onError: () => queryClient.invalidateQueries({ queryKey: ['engagements'] }),
  })
}
