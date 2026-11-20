// Written by hand from API.md「資料格式」. When the backend changes a field,
// change it here too: nothing checks that the two still match.
import type { AvatarShape } from '../../shared/avatar-shapes'

// API.md `User`: the person logged in, from GET /api/auth/session,
// POST /api/auth/login and POST /api/auth/register
export type User = {
  id: string
  email: string
  role: 'owner' | 'tester'
  display_name: string
  avatar_shape: AvatarShape
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

// Sent to POST /api/projects. Written from worker/projects/create.ts, not API.md:
// API.md「10. POST /api/projects」is older than the 發布專案 form.
// confidential_details, environment_info and test_items are left out until the
// form has a step for them.
export type CreateProjectBody = {
  name: string
  summary: string
  devices: (
    | {
        device_tag_id: string
        brand: string
        model: string | null
        min_os_version: string
      }
    | {
        device_tag_id: null
        custom_name: string
        min_os_version: string | null
      }
  )[]
  languages: { name: string; native_required: boolean }[]
  interest_tag_ids: string[]
  qa_experience_required: boolean
  min_qa_years?: 'under_1' | '1_to_2' | '3_to_5' | 'over_5'
  test_mode: 'remote' | 'onsite'
  test_city?: string
  start_date: string
  end_date: string
  reward: number
  how_to_test: string
  success_criteria: string
  special_requirements: string
}
