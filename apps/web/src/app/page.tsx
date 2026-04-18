/**
 * page.tsx — Home page (projects list)
 *
 * WHAT IS THIS?
 *   The first page users see. Shows all active projects.
 *   This is a Server Component — data is fetched on the server
 *   and sent to the browser as HTML. Fast and SEO-friendly.
 *
 * HOW NEXT.JS PAGES WORK:
 *   Every folder inside app/ with a page.tsx becomes a URL:
 *   app/page.tsx           → /
 *   app/retrieve/page.tsx  → /retrieve
 *   app/records/page.tsx   → /records
 *
 * DOCS: https://nextjs.org/docs/app/building-your-application/routing/pages
 */

import { createServerSupabaseClient } from '@/lib/supabase'
import type { Project } from '@/lib/types'
import { STAGE_LABELS, CLASSIFICATION_LABELS } from '@/lib/types'

// This page is a Server Component (no 'use client')
// It can directly fetch data from Supabase
export default async function HomePage() {
  const supabase = createServerSupabaseClient()

  // Fetch all projects from Supabase
  // .select('*') means "get all columns"
  // .order('created_at', { ascending: false }) means newest first
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch projects:', error)
  }

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <p className="text-xs font-mono text-oxblood uppercase tracking-widest mb-2">
          Active projects
        </p>
        <h1 className="text-3xl font-light text-gray-900">
          Data integration projects
        </h1>
        <p className="text-gray-500 mt-2">
          Select a project to view its decisions and precedents.
        </p>
      </div>

      {/* Projects grid */}
      {projects && projects.length > 0 ? (
        <div className="grid gap-4">
          {projects.map((project: Project) => (
            <a
              key={project.id}
              href={`/capture?project=${project.id}`}
              className="block bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-lg font-medium text-gray-900">
                    {project.name}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {project.description || 'No description.'}
                  </p>
                  <div className="flex gap-3 mt-3">
                    <span className="text-xs text-gray-400">
                      {project.department}
                    </span>
                    <span className="text-xs text-gray-300">·</span>
                    <span className="text-xs text-gray-400">
                      {project.stakeholders?.length || 0} stakeholders
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 ml-4">
                  <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {STAGE_LABELS[project.stage] || project.stage}
                  </span>
                  <span className="text-xs text-gray-400">
                    {CLASSIFICATION_LABELS[project.classification] || project.classification}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No projects yet.</p>
          <p className="text-sm mt-2">
            Run <code className="bg-gray-100 px-1 rounded">make seed</code> to
            load sample data.
          </p>
        </div>
      )}
    </div>
  )
}
