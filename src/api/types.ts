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
      profile: {
        real_name: string
        nickname: string // 最多 12 字
        phone: string
        city: string
      }
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

// API.md `Company`, from GET and PUT /api/auth/company
export type Company = {
  real_name: string
  email: string
  phone: string // 10 碼數字，沒有 - 和空白
  name: string // 公司名稱
  tax_id: string | null
  industry_tag: Tag
  address: string
}

// Sent to PUT /api/auth/company
export type SaveCompanyBody = {
  real_name: string
  phone: string
  name: string
  tax_id: string | null // 空字串視為沒填
  industry_tag_id: string
  address: string
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
  engagement: OwnProject['engagement'] // 只有負責人本人看得到，其他人一律是 null
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

// One row of the owner's 專案列表, from GET /api/auth/projects.
// Written from worker/auth/list-own-projects.ts.
export type OwnProject = {
  id: string
  name: string
  summary: string
  test_mode: 'remote' | 'onsite'
  test_city: string | null // null：遠端
  start_date: string // YYYY-MM-DD
  end_date: string // YYYY-MM-DD
  recruitment_status: 'recruiting' | 'closed' | 'cancelled' // 過了 end_date 的招募中專案是 closed
  // null：還沒有合作
  engagement: {
    id: string
    status: Exclude<EngagementStatus, 'CANCELLED'> // 取消的合作不算
    tester_name: string | null // FUNDED 之前是暱稱；null：還沒填暱稱
  } | null
  created_at: string
}

// A tester as the owner sees them before payment: no real name, email or phone.
// Written from worker/applications/lib/application.ts.
export type TesterCard = {
  tester_id: string
  nickname: string | null // null：暱稱功能之前註冊、還沒填暱稱
  avatar_shape: AvatarShape
  city: string
  qa_years: number | null // null：沒有 QA 經驗；0：有經驗、未滿 1 年
  languages: { name: string; native: boolean }[]
  devices: {
    device_tag_name: string | null // null：自訂裝置，名稱在 custom_name
    brand: string | null
    model: string | null
    os_version: string | null
    custom_name: string | null
  }[]
  interests: string[]
  average_score: number | null // null：還沒有評價
  rating_count: number
}

// From POST and GET /api/applications. Written from worker/applications/lib/application.ts.
export type Application = {
  id: string
  project: ProjectCard
  source: 'applied' | 'invited' // invited：接受邀請而來
  status: 'pending' | 'selected' | 'declined'
  created_at: string
  tester: TesterCard | null // null：測試人員看自己的申請
}

export type EngagementStatus =
  | 'PENDING_NDA'
  | 'PENDING_PAYMENT'
  | 'FUNDED'
  | 'TESTING'
  | 'SUBMITTED'
  | 'DISPUTED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUNDED'

// One row of GET /api/engagements. Written from worker/engagements/list.ts.
export type EngagementSummary = {
  id: string
  project: Pick<ProjectCard, 'id' | 'name' | 'summary' | 'devices'>
  status: EngagementStatus
  // 負責人看到測試人員（FUNDED 之前是暱稱），測試人員看到公司名稱；
  // null：負責人看還沒填暱稱的測試人員
  counterpart_name: string | null
  next_due_at: string | null // 目前狀態等的下一個期限
  updated_at: string
}

// From GET /api/engagements/{id} and POST /api/applications/{id}/select.
// Written from worker/engagements/lib/engagement.ts. Times not reached yet are null.
export type Engagement = {
  id: string
  status: EngagementStatus
  project: Pick<
    ProjectCard,
    'id' | 'name' | 'reward' | 'report_days' | 'devices'
  >
  owner: { company_name: string }
  tester: TesterCard
  nda_due_at: string
  nda_signed_at: string | null
  payment_due_at: string | null
  funded_at: string | null
  escrow_balance: number
  latest_payment: { status: 'pending' | 'paid' | 'failed' } | null
  settlement: {
    type: 'full_payout' | 'full_refund' | 'split'
    platform_fee: number
    payout: number
    refund: number
  } | null
  start_due_at: string | null
  environment_provided_at: string | null
  report_due_at: string | null
  report_overdue_at: string | null
  overdue_decision_due_at: string | null
  deadline_extended: boolean
  rejection_count: number
  review_due_at: string | null
  rating_due_at: string | null
  my_rating: {
    id: string
    engagement_id: string
    score: number
    comment: string
    submitted_at: string
    published_at: string | null
  } | null
  counterpart_rated: boolean
  created_at: string
  // FUNDED 以後（不含 CANCELLED）才有；之前是 null
  disclosed: {
    how_to_test: string
    success_criteria: string
    confidential_details: string | null
    test_items: { id: string; title: string; steps: string; expected: string }[]
    owner_contact: { real_name: string; phone: string; email: string }
    tester_contact: { real_name: string; phone: string; email: string }
  } | null
}

// What GET /api/engagements/{id}/nda gives to fill in the text, which is in
// src/pages/TesterNdaPage/. Written from worker/engagements/get-nda.ts.
// tester_name is the real name; the owner gets 王Ｏ明 before FUNDED
export type Nda = {
  company_name: string
  tester_name: string
  signed_at: string | null
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
