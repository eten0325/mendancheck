import { ScoringResult, Evaluation } from '@/types/scoring';

export function generateScoringResult(data: Record<string, string>): ScoringResult {
  // BMIの評価
  const bmi = parseFloat(data.BMI);
  const bmiScore = calculateBmiScore(bmi);
  const bmiEvaluation = evaluateBmi(bmi);

  // 血圧の評価
  const sbp = parseFloat(data.sBP);
  const dbp = parseFloat(data.dBP);
  const bpScore = calculateBpScore(sbp, dbp);
  const bpEvaluation = evaluateBloodPressure(sbp, dbp);

  // 血糖の評価
  const bs = parseFloat(data.BS);
  const hba1c = parseFloat(data.HbA1c);
  const bsScore = calculateBloodSugarScore(bs, hba1c);
  const bsEvaluation = evaluateBloodSugar(bs, hba1c);

  // 脂質の評価
  const ldl = parseFloat(data.LDL);
  const tg = parseFloat(data.TG);
  const lipidScore = calculateLipidScore(ldl, tg);
  const lipidEvaluation = evaluateLipid(ldl, tg);

  // 肝機能の評価
  const ast = parseFloat(data.AST);
  const alt = parseFloat(data.ALT);
  const gtp = parseFloat(data.γGTP || data.GTP);
  const liverScore = calculateLiverScore(ast, alt, gtp);
  const liverEvaluation = evaluateLiver(ast, alt, gtp);

  // 合計スコアの計算
  const totalScore = bmiScore + bpScore + bsScore + lipidScore + liverScore;

  return {
    id: data.ID,
    user_id: data.ID,
    bmi,
    systolic_blood_pressure: sbp,
    diastolic_blood_pressure: dbp,
    blood_sugar: bs,
    hba1c: hba1c,
    ldl_cholesterol: ldl,
    tg: tg,
    ast: ast,
    alt: alt,
    gamma_gtp: gtp,
    bmi_score: bmiScore,
    blood_pressure_score: bpScore,
    blood_sugar_score: bsScore,
    lipid_score: lipidScore,
    liver_function_score: liverScore,
    total_score: totalScore,
    bmi_evaluation: bmiEvaluation,
    bp_evaluation: bpEvaluation, // blood_pressure_evaluation -> bp_evaluation
    glucose_evaluation: bsEvaluation, // blood_sugar_evaluation -> glucose_evaluation
    lipid_evaluation: lipidEvaluation,
    liver_evaluation: liverEvaluation // liver_function_evaluation -> liver_evaluation
  };
}

// 評価関数の実装
function calculateBmiScore(bmi: number): number {
  if (bmi < 18.5 || bmi >= 30) return 0;
  if (bmi < 25) return 10;
  if (bmi < 30) return 5;
  return 0;
}

function evaluateBmi(bmi: number): Evaluation {
  if (bmi < 18.5 || bmi >= 30) return 'D';
  if (bmi < 25) return 'A';
  if (bmi < 30) return 'C';
  return 'D';
}

function calculateBpScore(sbp: number, dbp: number): number {
  if (sbp < 120 && dbp < 80) return 10;
  if (sbp < 130 && dbp < 85) return 8;
  if (sbp < 140 && dbp < 90) return 5;
  if (sbp < 160 && dbp < 100) return 3;
  return 0;
}

function evaluateBloodPressure(sbp: number, dbp: number): Evaluation {
  if (sbp < 120 && dbp < 80) return 'A';
  if (sbp < 130 && dbp < 85) return 'B';
  if (sbp < 140 && dbp < 90) return 'C';
  if (sbp < 160 && dbp < 100) return 'D';
  return 'D';
}

function calculateBloodSugarScore(bs: number, hba1c: number): number {
  if (bs < 100 && hba1c < 5.6) return 10;
  if (bs < 110 && hba1c < 6.0) return 8;
  if (bs < 126 && hba1c < 6.5) return 5;
  return 0;
}

function evaluateBloodSugar(bs: number, hba1c: number): Evaluation {
  if (bs < 100 && hba1c < 5.6) return 'A';
  if (bs < 110 && hba1c < 6.0) return 'B';
  if (bs < 126 && hba1c < 6.5) return 'C';
  return 'D';
}

function calculateLipidScore(ldl: number, tg: number): number {
  if (ldl < 120 && tg < 150) return 10;
  if (ldl < 140 && tg < 200) return 8;
  if (ldl < 160 && tg < 300) return 5;
  if (ldl < 180 && tg < 500) return 3;
  return 0;
}

function evaluateLipid(ldl: number, tg: number): Evaluation {
  if (ldl < 120 && tg < 150) return 'A';
  if (ldl < 140 && tg < 200) return 'B';
  if (ldl < 160 && tg < 300) return 'C';
  if (ldl < 180 && tg < 500) return 'D';
  return 'D';
}

function calculateLiverScore(ast: number, alt: number, gtp: number): number {
  if (ast < 30 && alt < 30 && gtp < 50) return 10;
  if (ast < 40 && alt < 40 && gtp < 70) return 8;
  if (ast < 50 && alt < 50 && gtp < 100) return 5;
  if (ast < 100 && alt < 100 && gtp < 150) return 3;
  return 0;
}

function evaluateLiver(ast: number, alt: number, gtp: number): Evaluation {
  if (ast < 30 && alt < 30 && gtp < 50) return 'A';
  if (ast < 40 && alt < 40 && gtp < 70) return 'B';
  if (ast < 50 && alt < 50 && gtp < 100) return 'C';
  if (ast < 100 && alt < 100 && gtp < 150) return 'D';
  return 'D';
}
