import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiError, request } from './client'
import type { Application, Engagement, Project } from './types'

export function useProjectApplications(projectId: string, enabled: boolean) {
  return useQuery({
    queryKey: ['applications', { projectId }],
    queryFn: () =>
      request<{ items: Application[] }>(
        `/api/applications?project_id=${projectId}`
      ),
    enabled,
  })
}

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

export function useSelectApplication(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (applicationId: string) =>
      request<Engagement>(`/api/applications/${applicationId}/select`, {
        method: 'POST',
      }),
    onSuccess: (engagement) => {
      queryClient.setQueryData(['engagements', engagement.id], engagement)
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['engagements', 'list'] })
    },
    onError: (error) => {
      // 409: chosen already, or recruitment ended; the project shows which
      if (error instanceof ApiError && error.status === 409) {
        queryClient.invalidateQueries({ queryKey: ['projects', projectId] })
        queryClient.invalidateQueries({
          queryKey: ['applications', { projectId }],
        })
      }
    },
  })
}
