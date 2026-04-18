/**
 * dashboard/page.tsx — Leadership portfolio view
 *
 * High-level view of all projects and decision coverage.
 * Placeholder for now — real analytics come in Phase 2.
 */

import { createServerSupabaseClient } from '@/lib/supabase'

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient()

  const [projectsResult, recordsResult] = await Promise.all([
    supabase.from('projects').select('id, stage', { count: 'exact' }),
    supabase.from('decision_records').select('id, domain', { count: 'exact' })
      .not('signed_off_at', 'is', null),
  ])

  const totalProjects = projectsResult.count || 0
  const totalRecords = recordsResult.count || 0

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-mono text-oxblood uppercase tracking-widest mb-2">
          Leadership view
        </p>
        <h1 className="text-3xl font-light text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-2">
          Portfolio coverage and decision activity.
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Active projects', value: totalProjects },
          { label: 'Decisions captured', value: totalRecords },
          { label: 'Domains covered', value: 5 },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-3xl font-light text-oxblood mb-1">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="font-medium text-gray-900 mb-4">Coming in Phase 2</h2>
        <ul className="text-sm text-gray-500 space-y-2">
          <li>· Decision coverage by domain and project</li>
          <li>· Time from intake to approval</li>
          <li>· Precedent reuse rate across projects</li>
          <li>· Outstanding reviews by domain lead</li>
          <li>· Audit export per project</li>
        </ul>
      </div>
    </div>
  )
}
