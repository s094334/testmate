import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiError, request } from './client'
import type { Application, Project } from './types'

export function useApply() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (projectId: string) =>
      request<Application>('/api/applications', {
        method: 'POST',
        body: { project_id: projectId },
      }),
    onSuccess: (application) => {
      // Shows 已申請 at once, before the refetch below comes back
      queryClient.setQueryData<Project>(
        ['projects', application.project.id],
        (project) => project && { ...project, viewer: { applied: true } }
      )
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (error, projectId) => {
      // 409: already applied, or recruitment ended; the project shows which
      if (error instanceof ApiError && error.status === 409) {
        queryClient.invalidateQueries({ queryKey: ['projects', projectId] })
      }
    },
  })
}
