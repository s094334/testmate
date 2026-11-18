// Written by hand from API.md「資料格式」. When the backend changes a field,
// change it here too: nothing checks that the two still match.

// API.md `User`: the person logged in, from GET /api/auth/session,
// POST /api/auth/login and POST /api/auth/register
export type User = {
  id: string
  email: string
  role: 'owner' | 'tester'
  display_name: string
}

// API.md `Tag`, from GET /api/tags
export type Tag = {
  id: string
  category: 'device' | 'industry' | 'interest' | 'audience'
  name: string
}
