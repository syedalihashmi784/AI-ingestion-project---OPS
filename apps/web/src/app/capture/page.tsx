/**
 * capture/page.tsx — Decision capture form
 *
 * The reviewer fills this in when approving a decision.
 * Pre-filled where possible from project context and precedents.
 */

'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { captureDecision } from '@/lib/api-client'
import type { Domain, DecisionType } from '@/lib/types'
import { DOMAIN_LABELS } from '@/lib/types'

export default function CapturePage() {
  const searchParams = useSearchParams()
  const projectId = searchParams.get('project') || ''

  const [form, setForm] = useState({
    project_id: projectId,
    domain: '' as Domain | '',
    decision_type: 'domain_signoff' as DecisionType,
    what: '',
    why: '',
    reviewer_name: '',
    reviewer_role: '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function updateField(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit() {
    if (!form.domain || !form.what || !form.why || !form.reviewer_name) {
      setError('Please fill in all required fields.')
      return
    }

    setSaving(true)
    setError(null)

    try {
      await captureDecision({
        ...form,
        domain: form.domain as Domain,
      })
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (saved) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-4">✓</div>
        <h2 className="text-xl font-medium text-gray-900 mb-2">Decision captured</h2>
        <p className="text-gray-500 mb-6">
          This decision is now in the ledger and available as a precedent for future projects.
        </p>
        <div className="flex gap-4 justify-center">
          <a href="/records" className="text-sm text-navy underline">
            View in ledger
          </a>
          <button
            onClick={() => { setSaved(false); setForm(f => ({ ...f, what: '', why: '' })) }}
            className="text-sm text-gray-500 underline"
          >
            Capture another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-mono text-oxblood uppercase tracking-widest mb-2">
          Capture decision
        </p>
        <h1 className="text-3xl font-light text-gray-900">
          Record a decision
        </h1>
        <p className="text-gray-500 mt-2">
          This record will enter the ledger and become available as a precedent for future projects.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">

        {/* Domain */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Domain <span className="text-red-500">*</span>
          </label>
          <select
            value={form.domain}
            onChange={(e) => updateField('domain', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy"
          >
            <option value="">Select domain</option>
            {(Object.entries(DOMAIN_LABELS) as [Domain, string][]).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* Decision type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Decision type <span className="text-red-500">*</span>
          </label>
          <select
            value={form.decision_type}
            onChange={(e) => updateField('decision_type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy"
          >
            <option value="intake">Intake assessment</option>
            <option value="domain_signoff">Domain sign-off</option>
            <option value="scope_change">Scope change</option>
            <option value="approval">Final approval</option>
            <option value="rejection">Rejection</option>
          </select>
        </div>

        {/* What was decided */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            What was decided <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-400 mb-2">
            One to three sentences. Plain language.
          </p>
          <textarea
            value={form.what}
            onChange={(e) => updateField('what', e.target.value)}
            placeholder="e.g. Approved data sharing with Province X using anonymised identifiers only."
            className="w-full h-20 px-4 py-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-navy"
          />
        </div>

        {/* Why */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Why — the rationale <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-400 mb-2">
            The reasoning behind the decision. Cite policies or legislation where relevant.
          </p>
          <textarea
            value={form.why}
            onChange={(e) => updateField('why', e.target.value)}
            placeholder="e.g. Privacy Impact Assessment completed. Compliant with Privacy Act s.8(2)(a). Direct identifiers not transmitted..."
            className="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-navy"
          />
        </div>

        {/* Reviewer */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reviewer name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.reviewer_name}
              onChange={(e) => updateField('reviewer_name', e.target.value)}
              placeholder="Full name"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <input
              type="text"
              value={form.reviewer_role}
              onChange={(e) => updateField('reviewer_role', e.target.value)}
              placeholder="e.g. Chief Privacy Officer"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2.5 bg-oxblood text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-opacity-90 transition-colors"
          >
            {saving ? 'Saving...' : 'Approve and capture decision'}
          </button>
          <a
            href="/"
            className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </a>
        </div>
      </div>
    </div>
  )
}
