import { useQuery } from '@tanstack/react-query'
import { request } from './client'
import type { ProjectCard } from './types'

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () =>
      request<{ items: ProjectCard[]; next_cursor: string | null }>(
        '/api/projects'
      ),
  })
}
