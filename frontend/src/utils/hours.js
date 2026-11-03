// Opening hours helpers (settings.hours = [{ day: 'Monday', time: '09:00 - 17:00' }, ...])
export const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const todayName = (date = new Date()) => DAYS[date.getDay()]

// "09:00 - 17:00" -> { open: 540, close: 1020 } (minutes). "Closed" -> null
export function parseRange(time = '') {
  const m = time.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/)
  if (!m) return null
  return { open: +m[1] * 60 + +m[2], close: +m[3] * 60 + +m[4] }
}

export function hoursFor(hours = [], date = new Date()) {
  return hours.find((h) => h.day.toLowerCase() === todayName(date).toLowerCase())
}

export function isOpenNow(hours = [], now = new Date()) {
  const r = parseRange(hoursFor(hours, now)?.time)
  if (!r) return false
  const mins = now.getHours() * 60 + now.getMinutes()
  return mins >= r.open && mins < r.close
}

const pad = (n) => String(n).padStart(2, '0')
export const toHHMM = (mins) => `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`
export const toISODate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

// Ek din ke saare available start times (duration minutes ke hisaab se)
export function slotsFor(hours, date, duration = 45, step = 15) {
  const r = parseRange(hoursFor(hours, date)?.time)
  if (!r) return []
  const out = []
  for (let t = r.open; t + duration <= r.close; t += step) out.push(toHHMM(t))
  return out
}
