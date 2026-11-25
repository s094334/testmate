import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query'
import { request } from './client'
import type { Project, ProjectCard } from './types'

export function useProjects(filters: { q: string; device: string }) {
  return useInfiniteQuery({
    queryKey: ['projects', 'list', filters],
    queryFn: ({ pageParam }) => {
      const params = new URLSearchParams()
      if (filters.q) params.set('q', filters.q)
      if (filters.device) params.set('device', filters.device)
      params.set('limit', '5')
      if (pageParam) params.set('cursor', pageParam)
      return request<{ items: ProjectCard[]; next_cursor: string | null }>(
        `/api/projects?${params}`
      )
    },
    // The first page has no cursor
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.next_cursor,
    placeholderData: keepPreviousData,
  })
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => request<Project>(`/api/projects/${id}`),
  })
}
