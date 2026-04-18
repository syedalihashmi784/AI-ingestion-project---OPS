/**
 * supabase.ts — Supabase client setup
 *
 * WHAT IS THIS?
 *   Creates the connection to your Supabase database.
 *   We create two different clients:
 *
 *   1. Browser client — used in React components (client-side)
 *      Uses the ANON key → respects Row Level Security
 *      Safe to use in the browser
 *
 *   2. Server client — used in Next.js API routes (server-side)
 *      Uses the ANON key with the user's session cookie
 *      Safer for operations that read session data
 *
 * WHY TWO CLIENTS?
 *   Next.js runs some code on the server (API routes, server components)
 *   and some in the browser (React components). The browser client
 *   handles auth differently than the server client.
 *
 * DOCS:
 *   https://supabase.com/docs/guides/auth/server-side/nextjs
 */

import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// ── These come from your .env.local file ────────────────
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// The ! at the end tells TypeScript "I know this is defined"
// If the env var is missing, you'll get an error on startup

// ── Browser client ──────────────────────────────────────
// Use this in React components (files with 'use client' at the top)
export function createBrowserSupabaseClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// ── Server client ───────────────────────────────────────
// Use this in Server Components and API route handlers
export function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Cookies can't be set in Server Components — that's OK
          // The middleware handles session refresh
        }
      },
    },
  })
}
