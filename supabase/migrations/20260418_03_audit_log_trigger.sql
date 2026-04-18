-- ─────────────────────────────────────────────────────────
-- Migration 03 — Auto-emit audit events on key changes
--
-- WHAT THIS DOES:
--   Automatically creates an audit event whenever a decision
--   record is created or approved. This means developers don't
--   have to remember to write audit log calls in application code.
--   The database handles it.
-- ─────────────────────────────────────────────────────────

-- Trigger: create audit event when a decision record is inserted
CREATE OR REPLACE FUNCTION audit_on_record_created()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_events (
        event_type,
        subject_type,
        subject_id,
        actor_name,
        actor_role,
        metadata
    ) VALUES (
        'record.created',
        'decision_record',
        NEW.id,
        COALESCE(NEW.reviewer_name, 'system'),
        COALESCE(NEW.reviewer_role, ''),
        jsonb_build_object(
            'domain', NEW.domain,
            'decision_type', NEW.decision_type,
            'project_id', NEW.project_id
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_decision_record_created
    AFTER INSERT ON decision_records
    FOR EACH ROW EXECUTE FUNCTION audit_on_record_created();


-- Trigger: create audit event when a decision is signed off
CREATE OR REPLACE FUNCTION audit_on_record_approved()
RETURNS TRIGGER AS $$
BEGIN
    -- Only fire when signed_off_at changes from NULL to a value
    IF OLD.signed_off_at IS NULL AND NEW.signed_off_at IS NOT NULL THEN
        INSERT INTO audit_events (
            event_type,
            subject_type,
            subject_id,
            actor_name,
            actor_role,
            metadata
        ) VALUES (
            'record.approved',
            'decision_record',
            NEW.id,
            NEW.reviewer_name,
            NEW.reviewer_role,
            jsonb_build_object(
                'domain', NEW.domain,
                'project_id', NEW.project_id,
                'version', NEW.version
            )
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_decision_record_approved
    AFTER UPDATE ON decision_records
    FOR EACH ROW EXECUTE FUNCTION audit_on_record_approved();
