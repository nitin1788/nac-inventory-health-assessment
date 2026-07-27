-- Migration 0001: companies table
--
-- Stores the company profile captured before the 52-question
-- assessment (see frontend features/assessment/questions/companyProfile.ts).
-- One row per submission — companies are not deduplicated/merged
-- across submissions in this milestone.

create extension if not exists pgcrypto;

create table if not exists companies (
  id                   uuid primary key default gen_random_uuid(),
  company_name         text not null,
  contact_person       text not null,
  designation          text not null,
  mobile               text not null,
  email                text not null,
  business_type        text not null,
  industry             text not null,
  employee_count       text not null,
  inventory_locations  text not null,
  active_skus          text not null,
  created_at           timestamptz not null default now()
);

create index if not exists idx_companies_email on companies (email);
