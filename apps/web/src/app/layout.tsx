/**
 * layout.tsx — Root layout
 *
 * WHAT IS THIS?
 *   In Next.js, layout.tsx wraps every page in your app.
 *   Anything in here (nav, footer, fonts) appears on every page.
 *
 * WHAT IS 'use client' vs not?
 *   Files WITHOUT 'use client' are Server Components — they run on the server.
 *   Files WITH 'use client' are Client Components — they run in the browser.
 *   Layout files are Server Components by default.
 *
 * DOCS: https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates
 */

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'The Decision Ledger',
  description: 'Institutional memory for data integration decisions.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {/* Navigation bar — appears on every page */}
        <nav className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-oxblood uppercase tracking-widest">
                Decision Ledger
              </span>
              <p className="text-xs text-gray-400 mt-0.5">
                Institutional memory for data integration decisions
              </p>
            </div>
            <nav className="flex gap-6 text-sm">
              <a href="/" className="text-gray-600 hover:text-gray-900">
                Projects
              </a>
              <a href="/records" className="text-gray-600 hover:text-gray-900">
                Ledger
              </a>
              <a href="/retrieve" className="text-gray-600 hover:text-gray-900">
                Search Precedents
              </a>
              <a href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </a>
            </nav>
          </div>
        </nav>

        {/* Page content */}
        <main className="max-w-6xl mx-auto px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
