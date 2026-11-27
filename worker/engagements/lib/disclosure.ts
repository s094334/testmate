import type { engagementStatuses } from '../../db/schema'

type EngagementStatus = (typeof engagementStatuses)[number]

// From FUNDED on, except CANCELLED: the payment is in escrow, so both sides
// see the confidential content and each other's contact details
export function isDisclosed(status: EngagementStatus) {
  return !['PENDING_NDA', 'PENDING_PAYMENT', 'CANCELLED'].includes(status)
}

// What the owner calls the tester: the real name once the payment is in
// escrow, the nickname before that, as on the applicant list
export function testerNameOf(
  status: EngagementStatus,
  tester: { realName: string; nickname: string }
) {
  return isDisclosed(status) ? tester.realName : tester.nickname || null
}
