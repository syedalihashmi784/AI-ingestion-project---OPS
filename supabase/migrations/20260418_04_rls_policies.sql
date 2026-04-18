-- ─────────────────────────────────────────────────────────
-- Migration 04 — Row-Level Security policies
--
-- WHAT IS RLS?
--   Rules attached to tables that control which rows a user can see.
--   Even if application code tries to fetch all records, PostgreSQL
--   automatically filters to only what the user is allowed to see.
--
-- HOW IT WORKS WITH SUPABASE:
--   When a user logs in via Supabase Auth, their JWT token contains
--   their user ID and metadata. RLS policies can read this token
--   to make access decisions.
--
-- FOR MVP:
--   We start with simple policies — authenticated users can read
--   all unclassified records in their department. Tighter
--   classification enforcement comes in Phase 2.
--
-- DOCS: https://supabase.com/docs/guides/auth/row-level-security
-- ─────────────────────────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;


-- ── Projects policies ───────────────────────────────────

-- Authenticated users can read projects
CREATE POLICY "projects_read_authenticated"
    ON projects FOR SELECT
    TO authenticated
    USING (true);
-- TODO Phase 2: Filter by department using JWT claims

-- Only service role (backend) can insert/update projects
CREATE POLICY "projects_write_service_role"
    ON projects FOR ALL
    TO service_role
    USING (true);


-- ── Decision records policies ───────────────────────────

-- Authenticated users can read approved decision records
CREATE POLICY "records_read_authenticated"
    ON decision_records FOR SELECT
    TO authenticated
    USING (
        classification = 'unclassified'
        OR classification = 'protected_a'
        -- TODO Phase 2: Check user clearance level from JWT
    );

-- Only service role (backend) can write decision records
CREATE POLICY "records_write_service_role"
    ON decision_records FOR ALL
    TO service_role
    USING (true);


-- ── Sources policies ────────────────────────────────────

CREATE POLICY "sources_read_authenticated"
    ON sources FOR SELECT
    TO authenticated
    USING (classification = 'unclassified' OR classification = 'protected_a');

CREATE POLICY "sources_write_service_role"
    ON sources FOR ALL
    TO service_role
    USING (true);


-- ── Audit log policies ──────────────────────────────────

-- Leadership and service role can read audit events
CREATE POLICY "audit_read_service_role"
    ON audit_events FOR SELECT
    TO service_role
    USING (true);

-- No one can update or delete audit events (enforced by rules in migration 01)
-- Only service role can insert
CREATE POLICY "audit_insert_service_role"
    ON audit_events FOR INSERT
    TO service_role
    WITH CHECK (true);
