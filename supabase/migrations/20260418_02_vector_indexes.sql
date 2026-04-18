-- ─────────────────────────────────────────────────────────
-- Migration 02 — Vector columns and indexes for AI search
--
-- WHAT IS PGVECTOR?
--   An extension that lets PostgreSQL store and search vectors.
--   A "vector" is a list of numbers (an "embedding") that
--   represents the meaning of a piece of text.
--
--   When you run text through an AI embedding model, you get back
--   ~1536 numbers that capture the semantic meaning. Two pieces of
--   text with similar meanings will have similar numbers.
--
--   This is how "find decisions similar to this query" works:
--   1. Convert the query to a vector (via AI model)
--   2. Find decision records whose vectors are closest
--   3. Return those records as results
--
-- DOCS: https://supabase.com/docs/guides/database/extensions/pgvector
-- ─────────────────────────────────────────────────────────

-- Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to decision_records
-- 1536 dimensions = OpenAI text-embedding-3-small / similar models
ALTER TABLE decision_records
    ADD COLUMN embedding vector(1536);

-- Add embedding to sources too (for source-level search)
ALTER TABLE sources
    ADD COLUMN embedding vector(1536);

-- Create vector similarity index on decision_records
-- This makes similarity searches fast even with thousands of records
-- ivfflat = index type, lists = number of clusters (tune for your data size)
CREATE INDEX idx_decision_records_embedding
    ON decision_records
    USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);

-- ── Helper function: find similar decisions ──────────────
-- This function is called from the application to find
-- the top-k most similar decisions to a given query embedding

CREATE OR REPLACE FUNCTION find_similar_decisions(
    query_embedding vector(1536),
    match_count     INTEGER DEFAULT 5,
    filter_domain   domain_type DEFAULT NULL
)
RETURNS TABLE (
    id              UUID,
    project_id      UUID,
    domain          domain_type,
    decision_type   decision_type,
    what            TEXT,
    why             TEXT,
    reviewer_name   TEXT,
    signed_off_at   TIMESTAMPTZ,
    similarity      FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        dr.id,
        dr.project_id,
        dr.domain,
        dr.decision_type,
        dr.what,
        dr.why,
        dr.reviewer_name,
        dr.signed_off_at,
        1 - (dr.embedding <=> query_embedding) AS similarity
    FROM decision_records dr
    WHERE
        dr.embedding IS NOT NULL
        AND dr.signed_off_at IS NOT NULL  -- only show approved decisions
        AND (filter_domain IS NULL OR dr.domain = filter_domain)
    ORDER BY dr.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;
