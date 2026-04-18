/**
 * api-client.ts — Typed client for the FastAPI backend
 *
 * WHAT IS THIS?
 *   Functions that call the FastAPI backend (running at localhost:8000).
 *   Each function wraps one API endpoint and returns typed data.
 *
 * WHY NOT CALL THE API DIRECTLY FROM COMPONENTS?
 *   Because having all API calls in one place means:
 *   - If the API URL changes, you change it in one place
 *   - TypeScript knows what each call returns
 *   - Easy to add auth headers, error handling, etc. consistently
 *
 * HOW TO USE:
 *   import { retrievePrecedents, captureDecision } from '@/lib/api-client'
 *
 *   const results = await retrievePrecedents({ query: 'data sharing with provinces' })
 */

import type {
  CaptureRequest,
  DecisionRecord,
  RetrievalRequest,
  RetrievalResponse,
} from './types'

// Base URL for the FastAPI backend
// In development: http://localhost:8000
// In production: your deployed API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// ── Helper function ─────────────────────────────────────
// All API calls go through this to handle errors consistently
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    // If the API returns an error, throw it so the calling code can handle it
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(error.detail || `API error: ${response.status}`)
  }

  return response.json()
}

// ── API functions ───────────────────────────────────────

/**
 * Find past decisions similar to a query.
 * This is the core "find precedents" operation.
 */
export async function retrievePrecedents(
  request: RetrievalRequest
): Promise<RetrievalResponse> {
  return apiFetch<RetrievalResponse>('/retrieve/', {
    method: 'POST',
    body: JSON.stringify(request),
  })
}

/**
 * Save an approved decision record to the ledger.
 */
export async function captureDecision(
  request: CaptureRequest
): Promise<{ id: string; status: string }> {
  return apiFetch('/capture/', {
    method: 'POST',
    body: JSON.stringify(request),
  })
}

/**
 * Get all decision records (with optional filters).
 */
export async function listRecords(params?: {
  domain?: string
  limit?: number
  offset?: number
}): Promise<{ records: DecisionRecord[]; total: number }> {
  const query = new URLSearchParams(
    Object.entries(params || {}).filter(([, v]) => v !== undefined) as [string, string][]
  )
  return apiFetch(`/records/?${query}`)
}

/**
 * Get a single decision record by ID.
 */
export async function getRecord(id: string): Promise<DecisionRecord> {
  return apiFetch<DecisionRecord>(`/records/${id}`)
}

/**
 * Export the full audit trail for a project.
 */
export async function exportAuditTrail(projectId: string) {
  return apiFetch(`/audit/export/${projectId}`)
}

/**
 * Check if the API is running.
 */
export async function healthCheck(): Promise<{ status: string }> {
  return apiFetch('/health')
}
