export function isPlainRecord(
  value: unknown
): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function safeJsonParse(raw: string | null | undefined): unknown {
  if (!raw) return undefined
  try {
    return JSON.parse(raw)
  } catch {
    return undefined
  }
}

export function readStorageJson(key: string): unknown {
  if (typeof window === 'undefined') return undefined
  try {
    const raw = window.localStorage.getItem(key)
    const parsed = safeJsonParse(raw)
    if (raw && parsed === undefined) {
      window.localStorage.removeItem(key)
    }
    return parsed
  } catch {
    return undefined
  }
}

export function readStorageRecord(
  key: string
): Record<string, unknown> | undefined {
  const parsed = readStorageJson(key)
  if (isPlainRecord(parsed)) return parsed
  if (parsed !== undefined && typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(key)
    } catch {
      /* empty */
    }
  }
  return undefined
}
