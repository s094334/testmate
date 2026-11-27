import type { engagementStatuses } from '../../db/schema'

type EngagementStatus = (typeof engagementStatuses)[number]

// From FUNDED on, except CANCELLED: the payment is in escrow, so both sides
// see the confidential content and each other's contact details
export function isDisclosed(status: EngagementStatus) {
  return !['PENDING_NDA', 'PENDING_PAYMENT', 'CANCELLED'].includes(status)
}

// GLOSSARY 去識別化姓名: 王小明 → 王Ｏ明, 歐陽小明 → 歐ＯＯ明, 王明 → 王Ｏ.
// Characters, not UTF-16 units, so a name with a rare character keeps it
// whole. The spec does not cover one character or an English name: one
// character becomes Ｏ, and an English name follows the same rule letter by
// letter, spaces included
export function maskName(name: string) {
  const characters = Array.from(name)
  if (characters.length <= 1) return 'Ｏ'
  if (characters.length === 2) return `${characters[0]}Ｏ`
  return `${characters[0]}${'Ｏ'.repeat(characters.length - 2)}${characters.at(-1)}`
}

// What the owner calls the tester: the real name once the payment is in
// escrow, the nickname before that, as on the applicant list
export function testerNameOf(
  status: EngagementStatus,
  tester: { realName: string; nickname: string }
) {
  return isDisclosed(status) ? tester.realName : tester.nickname || null
}
