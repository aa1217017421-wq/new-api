import { MESSAGE_ROLES, MESSAGE_STATUS, STORAGE_KEYS } from '../constants'
import type { PlaygroundConfig, ParameterEnabled, Message } from '../types'
import { sanitizeMessagesOnLoad } from './message-utils'

type StoredRecord = Record<string, unknown>

function isStoredRecord(value: unknown): value is StoredRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function removeStoredValue(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Failed to remove storage key ${key}:`, error)
  }
}

function normalizeStoredMessages(value: unknown): Message[] | null {
  if (!Array.isArray(value)) {
    return null
  }

  const roles = Object.values(MESSAGE_ROLES)
  const statuses = Object.values(MESSAGE_STATUS)

  return value.flatMap((item, index) => {
    if (!isStoredRecord(item) || !roles.includes(item.from as never)) {
      return []
    }

    const versions = Array.isArray(item.versions)
      ? item.versions.flatMap((version, versionIndex) => {
          if (!isStoredRecord(version)) {
            return []
          }

          const content =
            typeof version.content === 'string' ? version.content : ''
          const id =
            typeof version.id === 'string' && version.id
              ? version.id
              : `stored-${index}-${versionIndex}`

          return [{ id, content }]
        })
      : []

    if (versions.length === 0) {
      return []
    }

    const sources = Array.isArray(item.sources)
      ? item.sources.flatMap((source) => {
          if (
            !isStoredRecord(source) ||
            typeof source.href !== 'string' ||
            typeof source.title !== 'string'
          ) {
            return []
          }

          return [{ href: source.href, title: source.title }]
        })
      : undefined

    const reasoning = isStoredRecord(item.reasoning)
      ? {
          content:
            typeof item.reasoning.content === 'string'
              ? item.reasoning.content
              : '',
          duration:
            typeof item.reasoning.duration === 'number'
              ? item.reasoning.duration
              : 0,
        }
      : undefined

    return [
      {
        key:
          typeof item.key === 'string' && item.key
            ? item.key
            : `stored-${index}`,
        from: item.from as Message['from'],
        versions,
        ...(sources && sources.length > 0 ? { sources } : {}),
        ...(reasoning ? { reasoning } : {}),
        ...(typeof item.isReasoningStreaming === 'boolean'
          ? { isReasoningStreaming: item.isReasoningStreaming }
          : {}),
        ...(typeof item.isReasoningComplete === 'boolean'
          ? { isReasoningComplete: item.isReasoningComplete }
          : {}),
        ...(typeof item.isContentComplete === 'boolean'
          ? { isContentComplete: item.isContentComplete }
          : {}),
        ...(typeof item.status === 'string' &&
        statuses.includes(item.status as never)
          ? { status: item.status as Message['status'] }
          : {}),
        ...(typeof item.errorCode === 'string' || item.errorCode === null
          ? { errorCode: item.errorCode }
          : {}),
      },
    ]
  })
}

/**
 * Load playground config from localStorage
 */
export function loadConfig(): Partial<PlaygroundConfig> {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CONFIG)
    if (saved) {
      const parsed: unknown = JSON.parse(saved)
      if (isStoredRecord(parsed)) {
        return parsed as Partial<PlaygroundConfig>
      }
      removeStoredValue(STORAGE_KEYS.CONFIG)
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to load config:', error)
  }
  return {}
}

/**
 * Save playground config to localStorage
 */
export function saveConfig(config: Partial<PlaygroundConfig>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config))
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to save config:', error)
  }
}

/**
 * Load parameter enabled state from localStorage
 */
export function loadParameterEnabled(): Partial<ParameterEnabled> {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.PARAMETER_ENABLED)
    if (saved) {
      const parsed: unknown = JSON.parse(saved)
      if (isStoredRecord(parsed)) {
        return parsed as Partial<ParameterEnabled>
      }
      removeStoredValue(STORAGE_KEYS.PARAMETER_ENABLED)
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to load parameter enabled:', error)
  }
  return {}
}

/**
 * Save parameter enabled state to localStorage
 */
export function saveParameterEnabled(
  parameterEnabled: Partial<ParameterEnabled>
): void {
  try {
    localStorage.setItem(
      STORAGE_KEYS.PARAMETER_ENABLED,
      JSON.stringify(parameterEnabled)
    )
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to save parameter enabled:', error)
  }
}

/**
 * Load messages from localStorage
 */
export function loadMessages(): Message[] | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES)
    if (saved) {
      const parsed: unknown = JSON.parse(saved)
      const normalized = normalizeStoredMessages(parsed)
      if (!normalized) {
        removeStoredValue(STORAGE_KEYS.MESSAGES)
        return null
      }

      if (
        normalized.length === 0 &&
        Array.isArray(parsed) &&
        parsed.length > 0
      ) {
        saveMessages([])
        return []
      }

      const sanitized = sanitizeMessagesOnLoad(normalized)
      // Persist sanitized result to avoid re-sanitizing on subsequent loads
      if (
        sanitized !== normalized ||
        sanitized.length !== valueLength(parsed)
      ) {
        saveMessages(sanitized)
      }
      return sanitized
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to load messages:', error)
  }
  return null
}

/**
 * Save messages to localStorage
 */
export function saveMessages(messages: Message[]): void {
  try {
    if (!Array.isArray(messages)) {
      removeStoredValue(STORAGE_KEYS.MESSAGES)
      return
    }

    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages))
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to save messages:', error)
  }
}

function valueLength(value: unknown): number {
  return Array.isArray(value) ? value.length : 0
}

/**
 * Clear all playground data
 */
export function clearPlaygroundData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.CONFIG)
    localStorage.removeItem(STORAGE_KEYS.PARAMETER_ENABLED)
    localStorage.removeItem(STORAGE_KEYS.MESSAGES)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to clear playground data:', error)
  }
}
