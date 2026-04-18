/**
 * types.ts — TypeScript types for the Decision Ledger
 *
 * WHAT IS THIS?
 *   TypeScript lets you define the shape of your data.
 *   If you try to use a field that doesn't exist, TypeScript
 *   tells you immediately — before the code even runs.
 *
 *   These types mirror the Pydantic models in packages/schema/
 *   so both ends of the system agree on what data looks like.
 *
 * HOW TO USE:
 *   import type { DecisionRecord, Project } from '@/lib/types'
 */

// ── Enums ───────────────────────────────────────────────

export type Domain =
  | 'ethics'
  | 'privacy'
  | 'compliance'
  | 'risk'
  | 'tech_security'

export type DecisionType =
  | 'intake'
  | 'scope_change'
  | 'domain_signoff'
  | 'approval'
  | 'rejection'

export type Classification =
  | 'unclassified'
  | 'protected_a'
  | 'protected_b'
  | 'protected_c'

export type ProjectStage =
  | 'intake'
  | 'design'
  | 'review'
  | 'approved'
  | 'live'
  | 'closed'

// ── Core entities ───────────────────────────────────────

export interface Project {
  id: string
  name: string
  description: string
  department: string
  stage: ProjectStage
  classification: Classification
  stakeholders: string[]
  created_at: string
  updated_at: string
}

export interface DecisionRecord {
  id: string
  version: number
  project_id: string
  domain: Domain
  decision_type: DecisionType
  classification: Classification
  what: string
  why: string
  source_ids: string[]
  precedent_ids: string[]
  reviewer_name: string
  reviewer_role: string
  confidence: number
  created_at: string
  signed_off_at: string | null
  // Joined fields (when fetched with project data)
  project?: Project
}

export interface Source {
  id: string
  title: string
  document_type: string
  uri: string
  classification: Classification
  department: string
  created_at: string
}

export interface AuditEvent {
  id: string
  event_type: string
  subject_type: string
  subject_id: string
  actor_name: string
  actor_role: string
  metadata: Record<string, unknown>
  occurred_at: string
}

// ── API request/response types ──────────────────────────

export interface RetrievalRequest {
  query: string
  domain?: Domain
  limit?: number
}

export interface RetrievalResult extends DecisionRecord {
  similarity: number  // How similar this is to the query (0-1)
}

export interface RetrievalResponse {
  results: RetrievalResult[]
  total: number
}

export interface CaptureRequest {
  project_id: string
  domain: Domain
  decision_type: DecisionType
  what: string
  why: string
  reviewer_name: string
  reviewer_role?: string
  source_ids?: string[]
  precedent_ids?: string[]
}

// ── UI helper types ─────────────────────────────────────

// Human-readable labels for domain values
export const DOMAIN_LABELS: Record<Domain, string> = {
  ethics: 'Ethics',
  privacy: 'Privacy',
  compliance: 'Compliance',
  risk: 'Risk',
  tech_security: 'Tech Security',
}

// Colours for domain badges in the UI
export const DOMAIN_COLORS: Record<Domain, string> = {
  ethics: 'bg-purple-100 text-purple-800',
  privacy: 'bg-blue-100 text-blue-800',
  compliance: 'bg-amber-100 text-amber-800',
  risk: 'bg-red-100 text-red-800',
  tech_security: 'bg-green-100 text-green-800',
}

export const CLASSIFICATION_LABELS: Record<Classification, string> = {
  unclassified: 'Unclassified',
  protected_a: 'Protected A',
  protected_b: 'Protected B',
  protected_c: 'Protected C',
}

export const STAGE_LABELS: Record<ProjectStage, string> = {
  intake: 'Intake',
  design: 'Design',
  review: 'Review',
  approved: 'Approved',
  live: 'Live',
  closed: 'Closed',
}
