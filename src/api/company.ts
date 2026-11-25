import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { request } from './client'
import type { Company, SaveCompanyBody } from './types'

export function useCompany() {
  return useQuery({
    queryKey: ['company'],
    queryFn: () => request<Company>('/api/auth/company'),
  })
}

export function useSaveCompany() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: SaveCompanyBody) =>
      request<Company>('/api/auth/company', { method: 'PUT', body }),
    onSuccess: (company) => {
      queryClient.setQueryData(['company'], company)
      // The header's name is display_name from the session, which is the
      // owner's real name just saved
      queryClient.invalidateQueries({ queryKey: ['session'] })
    },
  })
}
