-- Migration 0004: assessment_answers table
--
-- One row per question answered in a given assessment. selected_score
-- is null for non-scorable questions (e.g. FIN-01's free-text answer).

create table if not exists assessment_answers (
  id               uuid primary key default gen_random_uuid(),
  assessment_id    uuid not null references assessments (id) on delete cascade,
  question_id      text not null,
  selected_option  text not null,
  selected_score   integer
);

create index if not exists idx_assessment_answers_assessment_id on assessment_answers (assessment_id);
