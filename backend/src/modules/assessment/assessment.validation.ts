import { z } from 'zod';
import { HEALTH_RATINGS } from './assessment.types';

const healthRatingSchema = z.enum([...HEALTH_RATINGS]);

const companySchema = z.object({
  companyName: z.string().min(1, 'Company name is required.'),
  contactPerson: z.string().min(1, 'Contact person is required.'),
  designation: z.string().min(1, 'Designation is required.'),
  mobile: z.string().min(1, 'Mobile number is required.'),
  email: z.string().email('A valid email address is required.'),
  businessType: z.string().min(1, 'Business type is required.'),
  industry: z.string().min(1, 'Industry is required.'),
  employeeCount: z.string().min(1, 'Number of employees is required.'),
  inventoryLocations: z.string().min(1, 'Number of inventory locations is required.'),
  activeSkus: z.string().min(1, 'Approximate active SKUs is required.'),
});

const answerSchema = z.object({
  questionId: z.string().min(1),
  selectedOption: z.string().min(1),
  selectedScore: z.number().int().nullable(),
});

const moduleScoreSchema = z.object({
  moduleId: z.string().min(1),
  moduleName: z.string().min(1),
  score: z.number().int().min(0),
  maxScore: z.number().int().min(0),
  percentage: z.number().min(0).max(100),
  rating: healthRatingSchema,
});

export const createAssessmentSchema = z.object({
  company: companySchema,
  overallScore: z.number().int().min(0),
  overallPercentage: z.number().min(0).max(100),
  healthRating: healthRatingSchema,
  answers: z.array(answerSchema).min(1, 'At least one answer is required.'),
  moduleScores: z.array(moduleScoreSchema).min(1, 'At least one module score is required.'),
});

export const assessmentIdParamsSchema = z.object({
  id: z.string().uuid('Invalid assessment id.'),
});
