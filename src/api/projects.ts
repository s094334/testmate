import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { request } from './client'
import type { Project, ProjectCard } from './types'

export function useProjects(filters: { q: string; device: string }) {
  return useQuery({
    queryKey: ['projects', 'list', filters],
    queryFn: () => {
      const params = new URLSearchParams()
      if (filters.q) params.set('q', filters.q)
      if (filters.device) params.set('device', filters.device)
      return request<{ items: ProjectCard[]; next_cursor: string | null }>(
        params.size ? `/api/projects?${params}` : '/api/projects'
      )
    },
    placeholderData: keepPreviousData,
  })
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => request<Project>(`/api/projects/${id}`),
  })
}
