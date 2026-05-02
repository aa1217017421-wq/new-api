import { api } from '@/lib/api'
import { isPlainRecord } from '@/lib/safe-json'
import type {
  ApiKey,
  ApiResponse,
  GetApiKeysParams,
  GetApiKeysResponse,
  SearchApiKeysParams,
  ApiKeyFormData,
} from './types'
import { apiKeySchema } from './types'

function normalizeApiKeys(value: unknown): ApiKey[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((item) => {
    const parsed = apiKeySchema.safeParse(item)
    return parsed.success ? [parsed.data] : []
  })
}

function normalizeApiKeysPayload(value: unknown): ApiKey[] {
  if (Array.isArray(value)) return normalizeApiKeys(value)
  if (isPlainRecord(value)) return normalizeApiKeys(value.items)
  return []
}

function numberOrDefault(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function stringOrUndefined(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}

function successOf(value: unknown): boolean {
  return isPlainRecord(value) && value.success === true
}

// ============================================================================
// API Key Management
// ============================================================================

// Get paginated API keys list
export async function getApiKeys(
  params: GetApiKeysParams = {}
): Promise<GetApiKeysResponse> {
  const { p = 1, size = 10 } = params
  const res = await api.get(`/api/token/?p=${p}&size=${size}`)
  const raw = res.data
  const rawData = isPlainRecord(raw?.data) ? raw.data : {}
  const items = normalizeApiKeys(rawData.items)
  return {
    success: successOf(raw),
    message: stringOrUndefined(raw?.message),
    data: {
      items,
      total: numberOrDefault(rawData.total, items.length),
      page: numberOrDefault(rawData.page, p),
      page_size: numberOrDefault(rawData.page_size, size),
    },
  }
}

// Search API keys by keyword or token (with pagination)
export async function searchApiKeys(
  params: SearchApiKeysParams
): Promise<{ success: boolean; message?: string; data?: ApiKey[] }> {
  const { keyword = '', token = '', p, size } = params
  const queryParams = new URLSearchParams()
  if (keyword) queryParams.set('keyword', keyword)
  if (token) queryParams.set('token', token)
  if (p != null) queryParams.set('p', String(p))
  if (size != null) queryParams.set('size', String(size))
  const res = await api.get(`/api/token/search?${queryParams.toString()}`)
  const raw = res.data
  return {
    success: successOf(raw),
    message: stringOrUndefined(raw?.message),
    data: normalizeApiKeysPayload(raw?.data),
  }
}

// Get single API key by ID
export async function getApiKey(id: number): Promise<ApiResponse<ApiKey>> {
  const res = await api.get(`/api/token/${id}`)
  const raw = res.data
  const parsed = apiKeySchema.safeParse(raw?.data)
  return {
    success: successOf(raw) && parsed.success,
    message: stringOrUndefined(raw?.message),
    data: parsed.success ? parsed.data : undefined,
  }
}

// Create a new API key
export async function createApiKey(
  data: ApiKeyFormData
): Promise<ApiResponse<ApiKey>> {
  const res = await api.post('/api/token/', data)
  return res.data
}

// Update an existing API key
export async function updateApiKey(
  data: ApiKeyFormData & { id: number }
): Promise<ApiResponse<ApiKey>> {
  const res = await api.put('/api/token/', data)
  return res.data
}

// Delete a single API key
export async function deleteApiKey(id: number): Promise<ApiResponse> {
  const res = await api.delete(`/api/token/${id}/`)
  return res.data
}

// Batch delete multiple API keys
export async function batchDeleteApiKeys(
  ids: number[]
): Promise<ApiResponse<number>> {
  const res = await api.post('/api/token/batch', { ids })
  return res.data
}

// Update API key status (enable/disable)
export async function updateApiKeyStatus(
  id: number,
  status: number
): Promise<ApiResponse<ApiKey>> {
  const res = await api.put('/api/token/?status_only=true', { id, status })
  return res.data
}

// Fetch the real (unmasked) key for a token by ID
export async function fetchTokenKey(
  id: number
): Promise<{ success: boolean; message?: string; data?: { key: string } }> {
  const res = await api.post(`/api/token/${id}/key`)
  return res.data
}

// Batch fetch real (unmasked) keys for multiple tokens
export async function fetchTokenKeysBatch(ids: number[]): Promise<{
  success: boolean
  message?: string
  data?: { keys: Record<number, string> }
}> {
  const res = await api.post('/api/token/batch/keys', { ids })
  const raw = res.data
  const keysRaw =
    isPlainRecord(raw?.data) && isPlainRecord(raw.data.keys)
      ? raw.data.keys
      : {}
  const keys: Record<number, string> = {}
  for (const [id, key] of Object.entries(keysRaw)) {
    if (typeof key === 'string') keys[Number(id)] = key
  }
  return {
    success: successOf(raw),
    message: stringOrUndefined(raw?.message),
    data: { keys },
  }
}
