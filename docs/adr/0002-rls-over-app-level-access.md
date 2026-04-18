# ADR 0002 — Use Row-Level Security for access control

**Date:** 2026-04-18
**Status:** Accepted

## Context

The Decision Ledger handles data at multiple classification levels
(Unclassified, Protected A, Protected B). We need to ensure that:
- A reviewer can only see records they have clearance for
- Records from Department A cannot be seen by Department B users
- This enforcement cannot be accidentally bypassed by application code bugs

## Decision

Use **PostgreSQL Row-Level Security (RLS)** policies to enforce access control
at the database level, rather than filtering in application code.

## What RLS means

RLS is a PostgreSQL feature that attaches security rules directly to tables.
When a user queries a table, the database automatically filters rows based
on who the user is — even if the application code doesn't filter.

Example:
```sql
-- Users can only see decision records from their own department
CREATE POLICY "dept_isolation" ON decision_records
  USING (department = auth.jwt()->>'department');
```

Even if a developer writes:
```python
# Tries to get ALL records
supabase.table("decision_records").select("*").execute()
```

The database will only return records the authenticated user is allowed to see.
The bug cannot leak data.

## Why not application-level filtering?

Application-level filtering (checking permissions in Python/TypeScript code)
is the common approach but has a critical weakness: one missing `WHERE` clause
or one bug in the permission check can expose data it shouldn't.

For a system handling government classification levels, database-level enforcement
is non-negotiable.

## Consequences

- **Good:** Security enforced at the lowest level — cannot be bypassed by bugs
- **Good:** Auditors can review security policies as SQL, not application code
- **Good:** Works automatically with Supabase's auth system
- **Watch:** RLS policies must be written carefully — test them explicitly
- **Watch:** Use the `anon` key in frontend (respects RLS), `service_role` key only in backend admin operations

## References
- https://supabase.com/docs/guides/auth/row-level-security
- https://www.postgresql.org/docs/current/ddl-rowsecurity.html
