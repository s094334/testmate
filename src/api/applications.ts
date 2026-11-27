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
    // Returns the refetch, so the mutation stays pending until the project
    // has its engagement and the page has moved on from the applicant list
    onSuccess: (engagement) => {
      queryClient.setQueryData(['engagements', engagement.id], engagement)
      queryClient.invalidateQueries({ queryKey: ['engagements', 'list'] })
      return queryClient.invalidateQueries({ queryKey: ['projects'] })
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

export function useDeclineApplication(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (applicationId: string) =>
      request<Application>(`/api/applications/${applicationId}/decline`, {
        method: 'POST',
      }),
    // Returns the refetch, so the card shows 已婉拒 from the server before
    // the buttons come back
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['applications', { projectId }],
      }),
    onError: (error) => {
      // 409: chosen or declined already; the list shows which
      if (error instanceof ApiError && error.status === 409) {
        queryClient.invalidateQueries({
          queryKey: ['applications', { projectId }],
        })
      }
    },
  })
}
