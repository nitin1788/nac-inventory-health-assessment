-- Migration 0005: module_scores table
--
-- One row per scored module within a given assessment (see the
-- frontend scoring engine's ModuleScore shape).

create table if not exists module_scores (
  id             uuid primary key default gen_random_uuid(),
  assessment_id  uuid not null references assessments (id) on delete cascade,
  module_id      text not null,
  module_name    text not null,
  score          integer not null,
  max_score      integer not null,
  percentage     numeric(5, 2) not null,
  rating         text not null check (rating in ('Excellent', 'Good', 'Needs Improvement', 'Critical'))
);

create index if not exists idx_module_scores_assessment_id on module_scores (assessment_id);
