export type Evaluation = 'A' | 'B' | 'C' | 'D';

export interface ScoringResult {
  id: string;
  user_id: string;
  total_score: number;
  bmi: number;
  bmi_evaluation: Evaluation;
  systolic_blood_pressure: number;
  diastolic_blood_pressure: number;
  bp_evaluation: Evaluation;
  blood_sugar: number;
  hba1c: number;
  glucose_evaluation: Evaluation;
  ldl_cholesterol: number;
  tg: number;
  lipid_evaluation: Evaluation;
  ast: number;
  alt: number;
  gamma_gtp: number;
  liver_evaluation: Evaluation;
}

export const EVALUATION_COLORS: Record<Evaluation, string> = {
  A: 'bg-green-100',
  B: 'bg-yellow-100',
  C: 'bg-orange-100',
  D: 'bg-red-100'
};