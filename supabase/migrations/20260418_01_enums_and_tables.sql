-- ─────────────────────────────────────────────────────────
-- Migration 01 — Core schema: enums and tables
--
-- WHAT IS A MIGRATION?
--   A SQL file that modifies the database schema.
--   Migrations run in order (by filename prefix).
--   Once run, they are never edited — a new migration is
--   created to change things.
--
-- HOW TO RUN:
--   supabase db push        ← push to local
--   supabase db push --db-url <url>  ← push to cloud
--
-- DOCS: https://supabase.com/docs/guides/cli/managing-environments
-- ─────────────────────────────────────────────────────────

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ── Enums (fixed value lists) ───────────────────────────

-- Which review domain a decision belongs to
CREATE TYPE domain_type AS ENUM (
    'ethics',
    'privacy',
    'compliance',
    'risk',
    'tech_security'
);

-- What kind of decision was recorded
CREATE TYPE decision_type AS ENUM (
    'intake',
    'scope_change',
    'domain_signoff',
    'approval',
    'rejection'
);

-- Canadian government security classification levels
CREATE TYPE classification_level AS ENUM (
    'unclassified',
    'protected_a',
    'protected_b',
    'protected_c'
);

-- Project lifecycle stages
CREATE TYPE project_stage AS ENUM (
    'intake',
    'design',
    'review',
    'approved',
    'live',
    'closed'
);


-- ── Projects table ──────────────────────────────────────

CREATE TABLE projects (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            TEXT NOT NULL,
    description     TEXT DEFAULT '',
    department      TEXT NOT NULL,
    stage           project_stage NOT NULL DEFAULT 'intake',
    classification  classification_level NOT NULL DEFAULT 'unclassified',
    stakeholders    TEXT[] DEFAULT '{}',   -- array of names/emails
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at on every change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ── Decision records table ──────────────────────────────

CREATE TABLE decision_records (
    -- Identity
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    version         INTEGER NOT NULL DEFAULT 1,

    -- What this is about
    project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    domain          domain_type NOT NULL,
    decision_type   decision_type NOT NULL,
    classification  classification_level NOT NULL DEFAULT 'unclassified',

    -- The decision itself
    what            TEXT NOT NULL,
    why             TEXT NOT NULL,

    -- References (stored as UUID arrays)
    source_ids      UUID[] DEFAULT '{}',
    precedent_ids   UUID[] DEFAULT '{}',

    -- Who approved it
    reviewer_name   TEXT NOT NULL,
    reviewer_role   TEXT DEFAULT '',

    -- AI metadata
    confidence      FLOAT DEFAULT 1.0 CHECK (confidence >= 0 AND confidence <= 1),

    -- Timestamps
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    signed_off_at   TIMESTAMPTZ
);

-- Index for fast project lookups
CREATE INDEX idx_decision_records_project_id
    ON decision_records(project_id);

-- Index for domain filtering
CREATE INDEX idx_decision_records_domain
    ON decision_records(domain);


-- ── Sources table ───────────────────────────────────────

CREATE TABLE sources (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title           TEXT NOT NULL,
    document_type   TEXT NOT NULL,  -- 'policy', 'project_file', 'legislation', etc.
    uri             TEXT DEFAULT '',
    classification  classification_level NOT NULL DEFAULT 'unclassified',
    department      TEXT DEFAULT '',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ── Audit log table (append-only) ──────────────────────

CREATE TABLE audit_events (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type      TEXT NOT NULL,      -- e.g. 'record.approved'
    subject_type    TEXT NOT NULL,      -- e.g. 'decision_record'
    subject_id      UUID NOT NULL,
    actor_name      TEXT NOT NULL,
    actor_role      TEXT DEFAULT '',
    metadata        JSONB DEFAULT '{}',
    occurred_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
    -- NOTE: No updated_at — audit events are never updated
);

-- Index for querying events by subject (e.g. all events for a project)
CREATE INDEX idx_audit_events_subject
    ON audit_events(subject_type, subject_id);

-- Prevent updates and deletes on audit log
-- This makes it truly append-only
CREATE OR REPLACE RULE audit_no_update AS ON UPDATE TO audit_events DO INSTEAD NOTHING;
CREATE OR REPLACE RULE audit_no_delete AS ON DELETE TO audit_events DO INSTEAD NOTHING;
