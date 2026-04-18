-- ─────────────────────────────────────────────────────────
-- Migration 05 — Helper functions for development seeding
--
-- WHAT THIS IS:
--   Convenience SQL functions used to populate the database
--   with realistic sample data during development.
--   These are safe to run in dev/staging, not production.
-- ─────────────────────────────────────────────────────────

-- Function to create a sample project quickly
CREATE OR REPLACE FUNCTION create_sample_project(
    p_name TEXT,
    p_department TEXT,
    p_stage project_stage DEFAULT 'review'
)
RETURNS UUID AS $$
DECLARE
    v_id UUID;
BEGIN
    INSERT INTO projects (name, department, stage)
    VALUES (p_name, p_department, p_stage)
    RETURNING id INTO v_id;
    RETURN v_id;
END;
$$ LANGUAGE plpgsql;
