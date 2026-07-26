import type { Question, QuestionBank } from './types';
import { inventoryPlanningModule, inventoryPlanningQuestions } from './inventoryPlanning';
import { inventoryControlModule, inventoryControlQuestions } from './inventoryControl';
import { inventoryAccuracyModule, inventoryAccuracyQuestions } from './inventoryAccuracy';
import { warehouseOperationsModule, warehouseOperationsQuestions } from './warehouseOperations';
import { procurementModule, procurementQuestions } from './procurement';
import { technologyModule, technologyQuestions } from './technology';
import { inventoryKpisModule, inventoryKpisQuestions } from './inventoryKpis';
import { riskComplianceModule, riskComplianceQuestions } from './riskCompliance';
import { finalAssessmentModule, finalAssessmentQuestions } from './finalAssessment';

export * from './types';

/**
 * The complete question bank — the real 41-question "FREE Inventory
 * Health Check Assessment" (Nitin Anand Consulting), assembled from
 * one file per module. Adding, removing, or editing a module means
 * touching only that module's file and this list — nothing in the
 * engine (hook/components) needs to change.
 */
export const QUESTION_BANK: QuestionBank = {
  modules: [
    inventoryPlanningModule,
    inventoryControlModule,
    inventoryAccuracyModule,
    warehouseOperationsModule,
    procurementModule,
    technologyModule,
    inventoryKpisModule,
    riskComplianceModule,
    finalAssessmentModule,
  ],
  questions: [
    ...inventoryPlanningQuestions,
    ...inventoryControlQuestions,
    ...inventoryAccuracyQuestions,
    ...warehouseOperationsQuestions,
    ...procurementQuestions,
    ...technologyQuestions,
    ...inventoryKpisQuestions,
    ...riskComplianceQuestions,
    ...finalAssessmentQuestions,
  ],
};

export function getModuleTitle(moduleId: string): string {
  return QUESTION_BANK.modules.find((module) => module.id === moduleId)?.title ?? moduleId;
}

export function getQuestionOptions(question: Question) {
  return question.options ?? [];
}
