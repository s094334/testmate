import { useQuery } from '@tanstack/react-query'
import { request } from './client'
import type { Project, ProjectCard } from './types'

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () =>
      request<{ items: ProjectCard[]; next_cursor: string | null }>(
        '/api/projects'
      ),
  })
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => request<Project>(`/api/projects/${id}`),
  })
}
