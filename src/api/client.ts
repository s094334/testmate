// Every error body follows API.md「回應格式」: { data: null, error: { code, message, details? } }
export class ApiError extends Error {
  status: number
  code: string
  details: { field: string; message: string }[]

  constructor(status: number, body: unknown) {
    const error =
      typeof body === 'object' && body !== null && 'error' in body
        ? (body.error as {
            code: string
            message: string
            details?: { field: string; message: string }[]
          })
        : // Not our JSON, e.g. the Vite proxy cannot reach wrangler dev
          {
            code: 'INTERNAL_ERROR',
            message: '發生錯誤，請稍後再試',
          }

    super(error.message)
    this.status = status
    this.code = error.code
    this.details = error.details ?? []
  }
}

// fetch, plus the steps every call to our API needs:
// send the body as JSON, give back the `data` inside { data, error },
// and throw ApiError on a 4xx/5xx so TanStack Query knows the request failed.
//
//   request<User>('/api/auth/session')
//   request<User>('/api/auth/login', { method: 'POST', body: { email, password } })
//
// <User> is only a promise to TypeScript; nothing checks the real reply.
export async function request<T>(
  path: string,
  options: { method?: 'GET' | 'POST' | 'PUT' | 'DELETE'; body?: unknown } = {}
): Promise<T> {
  const response = await fetch(path, {
    method: options.method ?? 'GET',
    headers:
      options.body === undefined
        ? undefined
        : { 'Content-Type': 'application/json' },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })

  // A 204 has no body
  if (response.status === 204) {
    return undefined as T
  }

  const json = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(response.status, json)
  }
  return json.data as T
}
