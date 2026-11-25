// Project dates are Taiwan dates. en-CA writes today as 2026-11-18, the same
// YYYY-MM-DD as start_date and end_date, so the strings compare in date order
export function taiwanToday() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Taipei' })
}
