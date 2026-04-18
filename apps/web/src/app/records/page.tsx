/**
 * records/page.tsx — The Ledger
 *
 * Shows all approved decision records.
 * This is the institutional memory — every decision ever captured.
 */

import { createServerSupabaseClient } from '@/lib/supabase'
import type { DecisionRecord } from '@/lib/types'
import { DOMAIN_LABELS, DOMAIN_COLORS, CLASSIFICATION_LABELS } from '@/lib/types'

export default async function RecordsPage() {
  const supabase = createServerSupabaseClient()

  const { data: records, error } = await supabase
    .from('decision_records')
    .select(`
      *,
      projects (name, department)
    `)
    .not('signed_off_at', 'is', null)
    .order('signed_off_at', { ascending: false })

  if (error) console.error('Failed to fetch records:', error)

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-mono text-oxblood uppercase tracking-widest mb-2">
          The ledger
        </p>
        <h1 className="text-3xl font-light text-gray-900">
          Decision records
        </h1>
        <p className="text-gray-500 mt-2">
          Every approved decision, with rationale and reviewer.
          {records && ` ${records.length} records captured.`}
        </p>
      </div>

      <div className="space-y-4">
        {records?.map((record: DecisionRecord & { projects?: { name: string; department: string } }) => (
          <div
            key={record.id}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex gap-2">
                <span className={`text-xs px-2 py-0.5 rounded font-medium ${DOMAIN_COLORS[record.domain]}`}>
                  {DOMAIN_LABELS[record.domain]}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                  {record.decision_type.replace('_', ' ')}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-gray-50 text-gray-400">
                  {CLASSIFICATION_LABELS[record.classification]}
                </span>
              </div>
              <span className="text-xs text-gray-400">
                {record.signed_off_at
                  ? new Date(record.signed_off_at).toLocaleDateString('en-CA')
                  : 'Draft'}
              </span>
            </div>

            {/* Project */}
            {record.projects && (
              <p className="text-xs text-gray-400 mb-2">
                {record.projects.name} · {record.projects.department}
              </p>
            )}

            {/* The decision */}
            <p className="text-gray-900 font-medium mb-2">{record.what}</p>
            <p className="text-gray-600 text-sm leading-relaxed">{record.why}</p>

            {/* Footer */}
            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                Reviewed by <strong>{record.reviewer_name}</strong>
                {record.reviewer_role && `, ${record.reviewer_role}`}
              </span>
              {record.precedent_ids?.length > 0 && (
                <span className="text-xs text-gray-400">
                  {record.precedent_ids.length} precedent{record.precedent_ids.length > 1 ? 's' : ''} cited
                </span>
              )}
            </div>
          </div>
        ))}

        {(!records || records.length === 0) && (
          <div className="text-center py-16 text-gray-400">
            <p>No approved records yet.</p>
            <p className="text-sm mt-2">
              Run <code className="bg-gray-100 px-1 rounded">make seed</code> to
              load sample data.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
