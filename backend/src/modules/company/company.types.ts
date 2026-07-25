/**
 * Domain types for the company module. Full repository/service
 * implementation lands in the Database/Backend-logic milestone once
 * the Supabase schema is migrated.
 */

export interface CompanyRecord {
  id: string;
  name: string;
  industry: string | null;
  companySize: string | null;
  contactName: string | null;
  email: string;
  phone: string | null;
  createdAt: string;
}
