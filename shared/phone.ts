// Mobile numbers are always saved as 0912345678. 0912-345-678, 0912 345 678,
// +886912345678, +886 912 345 678 and +8860912345678 all become that.
// Anything else only loses its spaces and dashes, so isPhone still rejects it.
export function normalizePhone(value: string) {
  return value.replace(/[\s-]/g, '').replace(/^\+8860?/, '0')
}

export function isPhone(value: string) {
  return /^09[0-9]{8}$/.test(normalizePhone(value))
}

export const phoneFormatMessage =
  '手機號碼須為 09 開頭的 10 碼數字，或 +886 開頭'
