-- Migration 0007: submit_assessment() — the single transactional
-- entry point for persisting a completed assessment.
--
-- Inserts the company, the assessment, its answers, and its module
-- scores inside one function invocation. A Postgres function runs in
-- the caller's transaction by default, so a failure at any step (e.g.
-- a check-constraint violation) rolls back everything already inserted
-- in this call — there is no way to end up with an orphaned company
-- or assessment row.
--
-- All jsonb parameters use the same camelCase keys as the HTTP
-- request body (see backend/src/modules/assessment/assessment.validation.ts)
-- so the repository layer can pass the validated payload straight
-- through without a separate case-mapping step.

create or replace function submit_assessment(
  p_company jsonb,
  p_overall_score integer,
  p_overall_percentage numeric,
  p_health_rating text,
  p_answers jsonb,
  p_module_scores jsonb
)
returns jsonb
language plpgsql
as $$
declare
  v_company_id       uuid;
  v_assessment_id    uuid;
  v_assessment_number text;
begin
  insert into companies (
    company_name, contact_person, designation, mobile, email,
    business_type, industry, employee_count, inventory_locations, active_skus
  )
  values (
    p_company ->> 'companyName',
    p_company ->> 'contactPerson',
    p_company ->> 'designation',
    p_company ->> 'mobile',
    p_company ->> 'email',
    p_company ->> 'businessType',
    p_company ->> 'industry',
    p_company ->> 'employeeCount',
    p_company ->> 'inventoryLocations',
    p_company ->> 'activeSkus'
  )
  returning id into v_company_id;

  insert into assessments (company_id, overall_score, overall_percentage, health_rating)
  values (v_company_id, p_overall_score, p_overall_percentage, p_health_rating)
  returning id, assessment_number into v_assessment_id, v_assessment_number;

  insert into assessment_answers (assessment_id, question_id, selected_option, selected_score)
  select
    v_assessment_id,
    entry ->> 'questionId',
    entry ->> 'selectedOption',
    (entry ->> 'selectedScore')::integer
  from jsonb_array_elements(p_answers) as entry;

  insert into module_scores (assessment_id, module_id, module_name, score, max_score, percentage, rating)
  select
    v_assessment_id,
    entry ->> 'moduleId',
    entry ->> 'moduleName',
    (entry ->> 'score')::integer,
    (entry ->> 'maxScore')::integer,
    (entry ->> 'percentage')::numeric,
    entry ->> 'rating'
  from jsonb_array_elements(p_module_scores) as entry;

  return jsonb_build_object('id', v_assessment_id, 'assessmentNumber', v_assessment_number);
end;
$$;
