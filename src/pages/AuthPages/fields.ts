import type { ComponentProps } from 'react'
import type { FieldValues, Path, RegisterOptions } from 'react-hook-form'
import { cities, industries } from './data'

export type FieldConfig<T extends FieldValues> = {
  label: string
  name: Path<T>
  type: string
  placeholder?: string
  requiredMessage?: string
  rules?: RegisterOptions<T, Path<T>>
  options?: string[]
  disablePlaceholder?: boolean
  hint?: string
  hideHintOnError?: boolean
} & Pick<
  ComponentProps<'input'>,
  'id' | 'autoComplete' | 'inputMode' | 'maxLength'
>

export type AccountFormValues = {
  email: string
  password: string
  confirmPassword: string
}

export type TesterProfileFormValues = {
  name: string
  phone: string
  city: string
}

export type OwnerProfileFormValues = {
  name: string
  phone: string
  company: string
  taxId: string
  industry: string
  address: string
}

export const accountFields: FieldConfig<AccountFormValues>[] = [
  {
    label: 'Email',
    name: 'email',
    type: 'email',
    autoComplete: 'email',
    placeholder: 'name@example.com',
    requiredMessage: '請填寫 Email',
    rules: {
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: '請輸入正確的 email 格式',
      },
    },
  },
  {
    label: '密碼',
    name: 'password',
    type: 'password',
    autoComplete: 'new-password',
    placeholder: '請輸入密碼',
    requiredMessage: '至少 8 碼，需包含英文與數字',
    rules: {
      pattern: {
        value: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
        message: '至少 8 碼，需包含英文與數字',
      },
      // When the password changes, check 確認密碼 again too
      deps: ['confirmPassword'],
    },
    hint: '至少 8 碼，需包含英文與數字',
    hideHintOnError: true,
  },
  {
    label: '確認密碼',
    name: 'confirmPassword',
    id: 'confirm-password',
    type: 'password',
    autoComplete: 'new-password',
    placeholder: '再輸入一次密碼',
    requiredMessage: '請再輸入一次密碼',
    rules: {
      validate: (value, values) =>
        value === values.password || '兩次密碼不一致',
    },
  },
]

export const testerProfileFields: FieldConfig<TesterProfileFormValues>[] = [
  {
    label: '姓名',
    name: 'name',
    type: 'text',
    autoComplete: 'name',
    placeholder: '例：哇哩勒',
    requiredMessage: '請填寫真實姓名',
    rules: { pattern: { value: /\S/, message: '請填寫真實姓名' } },
  },
  {
    label: '手機號碼',
    name: 'phone',
    type: 'tel',
    inputMode: 'tel',
    autoComplete: 'tel',
    placeholder: '例：0912-345-678',
    requiredMessage: '請填寫手機號碼',
    rules: {
      pattern: { value: /\S/, message: '請填寫手機號碼' },
      validate: (value) =>
        /^09\d{2}[-\s]?\d{3}[-\s]?\d{3}$/.test(value) ||
        '請輸入 09 開頭的 10 位數手機號碼',
    },
  },
  {
    label: '居住地',
    name: 'city',
    type: 'select',
    placeholder: '請選擇',
    options: cities,
    requiredMessage: '請選擇居住地',
  },
]

export const ownerProfileFields: FieldConfig<OwnerProfileFormValues>[] = [
  {
    label: '姓名',
    name: 'name',
    type: 'text',
    autoComplete: 'name',
    placeholder: '例：哇哩勒',
    requiredMessage: '請填寫真實姓名',
    rules: { pattern: { value: /\S/, message: '請' } },
  },
  {
    label: '手機號碼',
    name: 'phone',
    type: 'tel',
    inputMode: 'tel',
    autoComplete: 'tel',
    placeholder: '例：0912-345-678',
    requiredMessage: '請填寫手機號碼',
    rules: {
      // Spaces only counts as not filled in
      pattern: { value: /\S/, message: '請填寫手機號碼' },
      // 09 + 8 more digits; a hyphen or space between the groups is allowed
      validate: (value) =>
        /^09\d{2}[-\s]?\d{3}[-\s]?\d{3}$/.test(value) ||
        '請輸入 09 開頭的 10 位數手機號碼',
    },
  },
]

export const ownerCompanyFields: FieldConfig<OwnerProfileFormValues>[] = [
  {
    label: '公司名稱',
    name: 'company',
    type: 'text',
    autoComplete: 'organization',
    placeholder: '例：哇哩勒股份有限公司',
    requiredMessage: '請填寫公司名稱',
    rules: { pattern: { value: /\S/, message: '請填寫公司名稱' } },
  },
  {
    label: '統一編號',
    name: 'taxId',
    id: 'tax-id',
    type: 'text',
    inputMode: 'numeric',
    maxLength: 8,
    placeholder: '8 位數字',
    // Optional: an empty value skips this check
    rules: { pattern: { value: /^\d{8}$/, message: '統一編號是 8 位數字' } },
  },
  {
    label: '公司產業',
    name: 'industry',
    type: 'select',
    placeholder: '請選擇產業',
    disablePlaceholder: true,
    options: industries,
    requiredMessage: '請選擇公司產業',
    hint: '發布專案時會自動帶入，可再依專案修改',
  },
  {
    label: '公司地址',
    name: 'address',
    type: 'text',
    autoComplete: 'street-address',
    placeholder: '例：臺北市信義區市府路 1 號',
    requiredMessage: '請填寫公司地址',
    rules: { pattern: { value: /\S/, message: '請填寫公司地址' } },
  },
]
