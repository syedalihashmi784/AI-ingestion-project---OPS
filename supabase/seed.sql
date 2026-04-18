-- ─────────────────────────────────────────────────────────
-- seed.sql — Sample data for local development
--
-- WHAT THIS IS:
--   Realistic fake data that makes the app usable during
--   development. Without seed data, every screen is empty
--   and it's hard to build and test UI.
--
-- HOW TO RUN:
--   make seed
--   (or: supabase db reset)
--
-- NOTE: Never run this against production.
-- ─────────────────────────────────────────────────────────

-- ── Sample Projects ──────────────────────────────────────

INSERT INTO projects (id, name, description, department, stage, classification, stakeholders) VALUES
(
    '11111111-0000-0000-0000-000000000001',
    'Provincial Health Data Sharing Initiative',
    'Data sharing agreement with Ontario Ministry of Health for anonymised patient outcome data.',
    'Data Integration',
    'review',
    'protected_b',
    ARRAY['Jane Smith', 'Ahmed Hassan', 'Marie Tremblay']
),
(
    '11111111-0000-0000-0000-000000000002',
    'CRA Tax Records Cross-Reference',
    'Linking CRA records to internal benefit eligibility data for fraud detection.',
    'Data Integration',
    'approved',
    'protected_a',
    ARRAY['David Chen', 'Sarah O''Brien']
),
(
    '11111111-0000-0000-0000-000000000003',
    'Municipal Infrastructure Asset Registry',
    'Ingesting municipal road and bridge condition data for federal transfer payments.',
    'Data Integration',
    'intake',
    'unclassified',
    ARRAY['Priya Patel', 'Jean-Luc Bouchard']
),
(
    '11111111-0000-0000-0000-000000000004',
    'Immigration Status Verification API',
    'Real-time IRCC data lookup for employment eligibility verification.',
    'Data Integration',
    'closed',
    'protected_b',
    ARRAY['Tom Nguyen', 'Anna Kowalski']
);


-- ── Sample Decision Records ──────────────────────────────

INSERT INTO decision_records (
    id, project_id, domain, decision_type, classification,
    what, why, reviewer_name, reviewer_role,
    source_ids, precedent_ids, confidence, signed_off_at
) VALUES
(
    '22222222-0000-0000-0000-000000000001',
    '11111111-0000-0000-0000-000000000002',
    'privacy',
    'domain_signoff',
    'protected_a',
    'Approved data linkage between CRA tax records and internal benefit database using anonymised identifiers only.',
    'Privacy Impact Assessment completed. Direct identifiers (SIN, name, DOB) are not transmitted — only hashed internal IDs are used for linkage. Compliant with Privacy Act Section 8(2)(a) as data sharing is for a consistent use. Consent not required as data is used for fraud prevention which is a lawful authority under the Benefits Administration Act.',
    'Dr. Sarah Mitchell',
    'Chief Privacy Officer',
    ARRAY[]::UUID[],
    ARRAY[]::UUID[],
    0.95,
    NOW() - INTERVAL '45 days'
),
(
    '22222222-0000-0000-0000-000000000002',
    '11111111-0000-0000-0000-000000000002',
    'compliance',
    'domain_signoff',
    'protected_a',
    'Project is compliant with Treasury Board Directive on Service and Digital and meets all data management requirements.',
    'Review against TBS Directive on Service and Digital completed. Data retention schedule defined (7 years). Data quality standards documented. Interoperability profile completed and filed with Enterprise Architecture team. No exceptions required.',
    'Robert Fillion',
    'Compliance Lead',
    ARRAY[]::UUID[],
    ARRAY[]::UUID[],
    0.98,
    NOW() - INTERVAL '40 days'
),
(
    '22222222-0000-0000-0000-000000000003',
    '11111111-0000-0000-0000-000000000002',
    'risk',
    'approval',
    'protected_a',
    'Final approval granted. Residual risk accepted at Low tier. Project authorised to proceed to production.',
    'Risk register reviewed and accepted. Three risks identified: (1) Data quality variance in CRA source — mitigated by validation layer; (2) API latency under high load — mitigated by async processing and retry logic; (3) Regulatory change to Benefits Administration Act — monitored quarterly. Overall residual risk: Low. Approved under delegated authority.',
    'Director General, Data Operations',
    'Director General',
    ARRAY[]::UUID[],
    ARRAY['22222222-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000002']::UUID[],
    0.97,
    NOW() - INTERVAL '30 days'
),
(
    '22222222-0000-0000-0000-000000000004',
    '11111111-0000-0000-0000-000000000004',
    'privacy',
    'domain_signoff',
    'protected_b',
    'Approved with conditions. Immigration status data may be accessed only for active employment verification requests. Batch lookups not permitted.',
    'IRCC data sharing agreement reviewed. Data is Protected B and may not be stored beyond the duration of a single verification request (no caching). Access limited to named system accounts only. PIA required before any scope expansion. Condition: quarterly access log review by Privacy team.',
    'Dr. Sarah Mitchell',
    'Chief Privacy Officer',
    ARRAY[]::UUID[],
    ARRAY['22222222-0000-0000-0000-000000000001']::UUID[],
    0.92,
    NOW() - INTERVAL '180 days'
),
(
    '22222222-0000-0000-0000-000000000005',
    '11111111-0000-0000-0000-000000000004',
    'tech_security',
    'domain_signoff',
    'protected_b',
    'Security architecture approved. Mutual TLS required for all API calls. No data persistence on the requesting system.',
    'Threat model reviewed. Attack surface: API endpoint exposed to internal network only (not internet-facing). Authentication via client certificates (mTLS). Protected B data: encryption in transit (TLS 1.3) mandatory, encryption at rest enforced on IRCC side. Penetration test required before go-live. No caching or logging of response data permitted — responses are transient.',
    'James Okafor',
    'IT Security Lead',
    ARRAY[]::UUID[],
    ARRAY[]::UUID[],
    0.96,
    NOW() - INTERVAL '175 days'
);


-- ── Sample Sources ───────────────────────────────────────

INSERT INTO sources (id, title, document_type, uri, classification, department) VALUES
(
    '33333333-0000-0000-0000-000000000001',
    'Treasury Board Directive on Service and Digital',
    'legislation',
    'https://www.tbs-sct.canada.ca/pol/doc-eng.aspx?id=32601',
    'unclassified',
    'Treasury Board Secretariat'
),
(
    '33333333-0000-0000-0000-000000000002',
    'Privacy Act — R.S.C., 1985, c. P-21',
    'legislation',
    'https://laws-lois.justice.gc.ca/eng/acts/P-21/',
    'unclassified',
    'Department of Justice'
),
(
    '33333333-0000-0000-0000-000000000003',
    'CRA Data Sharing Agreement v3.2 — Internal',
    'project_file',
    'sharepoint://data-integration/agreements/CRA-DSA-v3.2.docx',
    'protected_a',
    'Data Integration'
);
