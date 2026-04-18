/**
 * retrieve/page.tsx — Precedent search
 *
 * The core interaction: describe a new project or decision,
 * see what similar decisions were made in the past.
 *
 * This is a Client Component because it needs user interaction
 * (typing in the search box, clicking the button).
 * 'use client' tells Next.js to run this in the browser.
 *
 * DOCS: https://nextjs.org/docs/app/building-your-application/rendering/client-components
 */

'use client'

import { useState } from 'react'
import { retrievePrecedents } from '@/lib/api-client'
import type { Domain, RetrievalResult } from '@/lib/types'
import { DOMAIN_LABELS, DOMAIN_COLORS } from '@/lib/types'

export default function RetrievePage() {
  // useState holds values that can change
  // When state changes, React re-renders the component
  // DOCS: https://react.dev/reference/react/useState
  const [query, setQuery] = useState('')
  const [domain, setDomain] = useState<Domain | ''>('')
  const [results, setResults] = useState<RetrievalResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  async function handleSearch() {
    if (!query.trim()) return

    setLoading(true)
    setError(null)
    setSearched(true)

    try {
      const response = await retrievePrecedents({
        query,
        domain: domain || undefined,
        limit: 5,
      })
      setResults(response.results)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-mono text-oxblood uppercase tracking-widest mb-2">
          Precedent search
        </p>
        <h1 className="text-3xl font-light text-gray-900">
          Find similar past decisions
        </h1>
        <p className="text-gray-500 mt-2">
          Describe a new project or decision. See what the institution decided before on similar requests.
        </p>
      </div>

      {/* Search form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe the decision or project
          </label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Data sharing agreement with a provincial health ministry for anonymised patient records..."
            className="w-full h-28 px-4 py-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
          />
        </div>

        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by domain (optional)
            </label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value as Domain | '')}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy"
            >
              <option value="">All domains</option>
              {(Object.entries(DOMAIN_LABELS) as [Domain, string][]).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="px-6 py-2 bg-navy text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 transition-colors"
          >
            {loading ? 'Searching...' : 'Find precedents'}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Results */}
      {searched && !loading && (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            {results.length > 0
              ? `${results.length} similar decision${results.length > 1 ? 's' : ''} found`
              : 'No similar decisions found in the ledger yet.'}
          </p>

          <div className="space-y-4">
            {results.map((record) => (
              <div
                key={record.id}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${DOMAIN_COLORS[record.domain]}`}>
                      {DOMAIN_LABELS[record.domain]}
                    </span>
                  </div>
                  <span className="text-xs font-mono bg-gray-50 text-gray-500 px-2 py-0.5 rounded">
                    {Math.round(record.similarity * 100)}% similar
                  </span>
                </div>

                <p className="text-gray-900 font-medium mb-2">{record.what}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{record.why}</p>

                <div className="mt-4 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    Reviewed by <strong>{record.reviewer_name}</strong>
                    {record.reviewer_role && `, ${record.reviewer_role}`}
                    {record.signed_off_at && ` · ${new Date(record.signed_off_at).toLocaleDateString('en-CA')}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
