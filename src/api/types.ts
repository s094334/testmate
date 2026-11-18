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

// API.md `RegisterBody`, sent to POST /api/auth/register
export type RegisterBody =
  | {
      email: string
      password: string
      role: 'tester'
      profile: { real_name: string; phone: string; city: string }
      agreed: true
    }
  | {
      email: string
      password: string
      role: 'owner'
      profile: {
        real_name: string
        phone: string
        name: string // 公司名稱
        tax_id: string | null // 8 碼數字；空字串視為沒填
        industry_tag_id: string
        address: string
      }
      agreed: true
    }

// API.md `Tag`, from GET /api/tags
export type Tag = {
  id: string
  category: 'device' | 'industry' | 'interest' | 'audience'
  name: string
}
