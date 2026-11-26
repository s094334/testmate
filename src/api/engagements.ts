import { useQuery } from '@tanstack/react-query'
import { request } from './client'
import type { Engagement, EngagementSummary } from './types'

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
