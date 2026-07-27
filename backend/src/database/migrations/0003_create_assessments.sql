-- Migration 0003: assessments table
--
-- One row per completed assessment submission. assessment_number is
-- generated automatically via generate_assessment_number() (Migration
-- 0002), so callers never need to compute or pass it in.

create table if not exists assessments (
  id                  uuid primary key default gen_random_uuid(),
  assessment_number   text not null unique default generate_assessment_number(),
  company_id          uuid not null references companies (id) on delete cascade,
  overall_score       integer not null,
  overall_percentage  numeric(5, 2) not null,
  health_rating       text not null check (health_rating in ('Excellent', 'Good', 'Needs Improvement', 'Critical')),
  created_at          timestamptz not null default now()
);

create index if not exists idx_assessments_company_id on assessments (company_id);
