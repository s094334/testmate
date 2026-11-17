// Every JSON response has both keys: { data, error }. See API.md「回應格式」.
import type { Context } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import type { ZodError } from 'zod'

// Only the codes used so far; add the rest from API.md「錯誤代碼」 as they are needed
export type ErrorCode =
  | 'VALIDATION_FAILED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'EMAIL_TAKEN'
  | 'INTERNAL_ERROR'

type ErrorDetail = { field: string; message: string }

export function ok<T, S extends ContentfulStatusCode = 200>(
  c: Context,
  data: T,
  status: S = 200 as S
) {
  return c.json({ data, error: null }, status)
}

export function fail<S extends ContentfulStatusCode>(
  c: Context,
  status: S,
  code: ErrorCode,
  message: string,
  details?: ErrorDetail[]
) {
  return c.json(
    {
      data: null,
      error: details ? { code, message, details } : { code, message },
    },
    status
  )
}

export function validationFailed(c: Context, error: ZodError) {
  const details = error.issues.flatMap((issue) => {
    const field = issue.path
      .map((key, i) =>
        typeof key === 'number'
          ? `[${key}]`
          : i === 0
            ? String(key)
            : `.${String(key)}`
      )
      .join('')

    if (issue.code === 'unrecognized_keys') {
      return issue.keys.map((key) => ({
        field: field ? `${field}.${key}` : key,
        message: issue.message,
      }))
    }
    return [{ field, message: issue.message }]
  })

  return fail(c, 400, 'VALIDATION_FAILED', details[0].message, details)
}
