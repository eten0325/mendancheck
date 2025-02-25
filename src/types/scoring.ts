export type Evaluation = 'A' | 'B' | 'C' | 'D';

export interface ScoringResult {
  id: string;
  user_id: string;
  bmi: number;
  systolic_blood_pressure: number;
  diastolic_blood_pressure: number;
  blood_sugar: number;
  hba1c: number;
  ldl_cholesterol: number;
  tg: number;
  ast: number;
  alt: number;
  gamma_gtp: number;
  bmi_score: number;
  blood_pressure_score: number;
  blood_sugar_score: number;
  lipid_score: number;
  liver_function_score: number;
  total_score: number;
  bmi_evaluation: Evaluation;
  bp_evaluation: Evaluation; // データベースのカラム名と一致させる
  glucose_evaluation: Evaluation; // データベースのカラム名と一致させる
  lipid_evaluation: Evaluation;
  liver_evaluation: Evaluation; // データベースのカラム名と一致させる
}

export const EVALUATION_COLORS: Record<Evaluation, string> = {
  A: 'bg-green-100',
  B: 'bg-yellow-100',
  C: 'bg-orange-100',
  D: 'bg-red-100'
};
