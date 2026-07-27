-- Migration 0006: lock down direct access to assessment data.
--
-- The backend is the only client that ever talks to Supabase (see
-- docs/ARCHITECTURE.md) and always uses the service-role key, which
-- bypasses Row Level Security entirely. Enabling RLS here with no
-- policies simply ensures that if an anon/public key were ever used
-- against these tables by mistake, it would see and change nothing.

alter table companies enable row level security;
alter table assessments enable row level security;
alter table assessment_answers enable row level security;
alter table module_scores enable row level security;
