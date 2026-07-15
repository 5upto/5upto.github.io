const MONTHS: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
  jan: 0, feb: 1, mar: 2, apr: 3, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
}

function parseMonthYear(s: string): number | null {
  const m = s.trim().toLowerCase()
  for (const [key, monthIdx] of Object.entries(MONTHS)) {
    if (m.startsWith(key)) {
      const yearStr = m.replace(key, '').trim()
      const year = parseInt(yearStr, 10)
      if (!isNaN(year)) return new Date(year, monthIdx).getTime()
    }
  }
  return null
}

export function parseDateField(text: string): number {
  if (!text) return 0
  const t = text.trim()

  // "Jun 2026 – Present" or "Oct 2025 – May 2026" → take start
  const rangeMatch = t.match(/^(.+?)\s*[–-]/)
  if (rangeMatch) {
    const start = parseMonthYear(rangeMatch[1])
    if (start !== null) return start
  }

  // "21–22 February 2025" → extract "February 2025"
  const dayRangeMatch = t.match(/\d+\s*[–-]\d+\s+(.+)/)
  if (dayRangeMatch) {
    const start = parseMonthYear(dayRangeMatch[1])
    if (start !== null) return start
  }

  // standalone "Jun 2025"
  const single = parseMonthYear(t)
  if (single !== null) return single

  // plain year "2025"
  const year = parseInt(t, 10)
  if (!isNaN(year)) return new Date(year, 0).getTime()

  return 0
}

export function sortByDate<T>(items: T[], dateField: keyof T): T[] {
  return [...items].sort((a, b) => parseDateField(String(a[dateField])) - parseDateField(String(b[dateField])))
}
