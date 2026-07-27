/**
 * Domain types for the company module. Mirrors the `companies` table
 * (see backend/src/database/migrations/0001_create_companies.sql) and
 * the frontend's CompanyProfile — field names here are the wire/DB
 * names (camelCase over HTTP, snake_case in Postgres), not the
 * frontend form's own field names.
 */

export interface CompanyInput {
  companyName: string;
  contactPerson: string;
  designation: string;
  mobile: string;
  email: string;
  businessType: string;
  industry: string;
  employeeCount: string;
  inventoryLocations: string;
  activeSkus: string;
}

export interface CompanyRecord extends CompanyInput {
  id: string;
  createdAt: string;
}
