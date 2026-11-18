import { useQuery } from '@tanstack/react-query'
import { request } from './client'
import type { Tag } from './types'

export function useTags(category: Tag['category']) {
  return useQuery({
    queryKey: ['tags', category],
    queryFn: () => request<{ items: Tag[] }>(`/api/tags?category=${category}`),
  })
}
