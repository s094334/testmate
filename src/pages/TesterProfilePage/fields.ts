import type { ComponentProps } from 'react'
import type { Path, RegisterOptions } from 'react-hook-form'
import type { Payout } from '@/data/tester'

export type FieldConfig = {
  label: string
  name: Path<Payout>
  requiredMessage?: string
  rules?: RegisterOptions<Payout, Path<Payout>>
} & Pick<ComponentProps<'input'>, 'inputMode' | 'autoComplete'>

export const payoutFields: FieldConfig[] = [
  {
    label: '銀行代碼',
    name: 'bankCode',
    inputMode: 'numeric',
    autoComplete: 'off',
    requiredMessage: '請填寫銀行代碼',
  },
  {
    label: '分行代碼',
    name: 'branchCode',
    inputMode: 'numeric',
    autoComplete: 'off',
  },
  {
    label: '帳號',
    name: 'accountNumber',
    inputMode: 'numeric',
    autoComplete: 'off',
    requiredMessage: '請填寫帳號',
  },
  {
    label: '戶名',
    name: 'holderName',
    autoComplete: 'name',
    requiredMessage: '請填寫戶名',
    rules: { validate: (value) => value.trim() !== '' || '請填寫戶名' },
  },
]
