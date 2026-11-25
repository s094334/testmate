import { z } from '@hono/zod-openapi'

// The sort key of the last project on a page: created_at as the database
// stores it (UTC milliseconds, so nothing is rounded) and id.
// base64url, so it goes into a query string without escaping
const cursorContent = z.object({
  createdAt: z.int().pipe(z.coerce.date()),
  id: z.uuid(),
})

export function encodeCursor(project: { createdAt: Date; id: string }) {
  return btoa(
    JSON.stringify({ createdAt: project.createdAt.getTime(), id: project.id })
  )
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '')
}

// null for anything encodeCursor did not make
export function decodeCursor(cursor: string) {
  try {
    return cursorContent.parse(
      JSON.parse(atob(cursor.replaceAll('-', '+').replaceAll('_', '/')))
    )
  } catch {
    return null
  }
}
