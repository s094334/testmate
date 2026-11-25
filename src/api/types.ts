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

// 我的檔案, from GET and PUT /api/auth/profile. Written from
// worker/auth/lib/profile.ts, not API.md: API.md `TesterProfile` has no nickname yet.
export type TesterProfile = {
  real_name: string
  nickname: string // ''：暱稱功能上線前註冊、還沒填暱稱的帳號
  email: string
  phone: string // 10 碼數字，沒有 - 和空白
  city: string
  has_qa_experience: boolean
  experiences: {
    company: string
    years: 'under_1' | '1_to_2' | '3_to_5' | 'over_5' // 同發布專案的 min_qa_years
  }[]
  qa_years: number // 唯讀，每段經歷取範圍下限加總（暫定）
  languages: { name: string; native: boolean }[]
  devices: {
    id: string
    device_tag: Tag | null // null：自訂裝置，名稱在 custom_name
    brand: string | null
    model: string | null
    os_version: string | null
    custom_name: string | null
  }[]
  interests: Tag[]
  updated_at: string
}

// Sent to PUT /api/auth/profile. Written from worker/auth/save-profile.ts.
// It replaces the whole profile: a list left out is saved as empty.
export type SaveProfileBody = {
  real_name: string
  nickname: string
  phone: string
  city: string
  has_qa_experience: boolean
  experiences: TesterProfile['experiences'] // has_qa_experience 為 false 時要是 []
  languages: { name: string; native: boolean }[]
  devices: {
    device_tag_id: string | null // null：自訂裝置
    brand?: string | null
    model?: string | null
    os_version?: string | null
    custom_name?: string | null
  }[]
  interest_tag_ids: string[]
}

// One row of 搜尋專案, from GET /api/projects. Written from worker/projects/list.ts,
// not API.md: API.md `Project` is older than the 發布專案 form.
export type ProjectCard = {
  id: string
  name: string
  summary: string
  company: {
    name: string
    average_score: number | null // null：還沒有評價
    rating_count: number
  }
  industry: Tag
  interests: Tag[]
  devices: {
    id: string
    device_tag: Tag | null // null：自訂裝置，名稱在 custom_name
    brand: string | null
    model: string | null
    min_os_version: string | null
    custom_name: string | null
  }[]
  end_date: string // YYYY-MM-DD
  reward: number
  report_days: number
  application_count: number
  created_at: string
}

// 專案詳情, from GET /api/projects/{id}: everything in ProjectCard and more.
// Written from worker/projects/lib/project.ts, not API.md, like ProjectCard.
// closed and cancelled projects come back too.
export type Project = ProjectCard & {
  owner_id: string
  languages: { name: string; native_required: boolean }[]
  qa_experience_required: boolean
  min_qa_years: 'under_1' | '1_to_2' | '3_to_5' | 'over_5' | null
  test_mode: 'remote' | 'onsite'
  test_city: string | null // null：遠端
  start_date: string // YYYY-MM-DD
  special_requirements: string | null
  recruitment_status: 'recruiting' | 'closed' | 'cancelled'
  viewer: { applied: boolean } | null // null：不是登入的測試人員
  confidential: {
    how_to_test: string
    success_criteria: string
    confidential_details: string | null
    // 待清除的遺留欄位: the platform decided not to collect 測試環境說明, but
    // the backend still sends it, always null. Do not show or send it.
    environment_info: string | null
    test_items: { id: string; title: string; steps: string; expected: string }[]
  } | null // null：不是這個專案的負責人
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
