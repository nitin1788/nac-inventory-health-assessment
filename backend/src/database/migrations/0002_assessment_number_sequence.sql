-- Migration 0002: per-year assessment number generator
--
-- Produces sequential, human-readable assessment numbers in the
-- format NAC-<year>-<6-digit sequence>, e.g. NAC-2026-000001. The
-- upsert below is safe under concurrent inserts — Postgres resolves
-- the ON CONFLICT race with a row-level lock, so two simultaneous
-- submissions in the same year can never receive the same number.

create table if not exists assessment_number_counters (
  year         integer primary key,
  last_number  integer not null default 0
);

create or replace function generate_assessment_number()
returns text
language plpgsql
as $$
declare
  v_year        integer := extract(year from now())::integer;
  v_next_number integer;
begin
  insert into assessment_number_counters (year, last_number)
  values (v_year, 1)
  on conflict (year)
    do update set last_number = assessment_number_counters.last_number + 1
  returning last_number into v_next_number;

  return 'NAC-' || v_year || '-' || lpad(v_next_number::text, 6, '0');
end;
$$;
