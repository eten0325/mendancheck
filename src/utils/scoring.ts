import { Evaluation, ScoringResult } from '../types/scoring';

// 評価に応じた点数を返す
export const getScoreFromEvaluation = (evaluation: Evaluation): number => {
  switch (evaluation) {
    case 'A': return 1;
    case 'B': return 2;
    case 'C': return 4;
    case 'D': return 8;
  }
};

// BMIの評価を行う
export const evaluateBMI = (bmi: number): Evaluation => {
  if (bmi < 25) return 'A';
  if (bmi < 30) return 'B';
  if (bmi < 35) return 'C';
  return 'D';
};

// 血圧の評価を行う
export const evaluateBloodPressure = (
  systolic: number,
  diastolic: number
): Evaluation => {
  let systolicEval: Evaluation;
  let diastolicEval: Evaluation;

  // 収縮期血圧の評価
  if (systolic < 130) systolicEval = 'A';
  else if (systolic < 140) systolicEval = 'B';
  else if (systolic < 160) systolicEval = 'C';
  else systolicEval = 'D';

  // 拡張期血圧の評価
  if (diastolic < 85) diastolicEval = 'A';
  else if (diastolic < 90) diastolicEval = 'B';
  else if (diastolic < 100) diastolicEval = 'C';
  else diastolicEval = 'D';

  // より高いリスクの評価を返す
  const systolicScore = getScoreFromEvaluation(systolicEval);
  const diastolicScore = getScoreFromEvaluation(diastolicEval);
  return systolicScore >= diastolicScore ? systolicEval : diastolicEval;
};

// 血糖値の評価を行う
export const evaluateGlucose = (
  bloodSugar: number,
  hba1c: number
): Evaluation => {
  let bsEval: Evaluation;
  let hba1cEval: Evaluation;

  // 血糖値の評価
  if (bloodSugar < 100) bsEval = 'A';
  else if (bloodSugar < 110) bsEval = 'B';
  else if (bloodSugar < 126) bsEval = 'C';
  else bsEval = 'D';

  // HbA1cの評価
  if (hba1c < 5.5) hba1cEval = 'A';
  else if (hba1c < 6.0) hba1cEval = 'B';
  else if (hba1c < 6.4) hba1cEval = 'C';
  else hba1cEval = 'D';

  // より高いリスクの評価を返す
  const bsScore = getScoreFromEvaluation(bsEval);
  const hba1cScore = getScoreFromEvaluation(hba1cEval);
  return bsScore >= hba1cScore ? bsEval : hba1cEval;
};

// 脂質の評価を行う
export const evaluateLipid = (
  ldl: number,
  tg: number
): Evaluation => {
  let ldlEval: Evaluation;
  let tgEval: Evaluation;

  // LDLの評価
  if (ldl < 120) ldlEval = 'A';
  else if (ldl < 140) ldlEval = 'B';
  else if (ldl < 180) ldlEval = 'C';
  else ldlEval = 'D';

  // TGの評価
  if (tg < 150) tgEval = 'A';
  else if (tg < 300) tgEval = 'B';
  else if (tg < 500) tgEval = 'C';
  else tgEval = 'D';

  // より高いリスクの評価を返す
  const ldlScore = getScoreFromEvaluation(ldlEval);
  const tgScore = getScoreFromEvaluation(tgEval);
  return ldlScore >= tgScore ? ldlEval : tgEval;
};

// 肝機能の評価を行う
export const evaluateLiver = (
  ast: number,
  alt: number,
  gammaGtp: number
): Evaluation => {
  let astEval: Evaluation;
  let altEval: Evaluation;
  let gtpEval: Evaluation;

  // ASTの評価
  if (ast < 31) astEval = 'A';
  else if (ast < 35) astEval = 'B';
  else if (ast < 50) astEval = 'C';
  else astEval = 'D';

  // ALTの評価
  if (alt < 31) altEval = 'A';
  else if (alt < 40) altEval = 'B';
  else if (alt < 50) altEval = 'C';
  else altEval = 'D';

  // γGTPの評価
  if (gammaGtp < 51) gtpEval = 'A';
  else if (gammaGtp < 80) gtpEval = 'B';
  else if (gammaGtp < 100) gtpEval = 'C';
  else gtpEval = 'D';

  // 最も高いリスクの評価を返す
  const astScore = getScoreFromEvaluation(astEval);
  const altScore = getScoreFromEvaluation(altEval);
  const gtpScore = getScoreFromEvaluation(gtpEval);
  const maxScore = Math.max(astScore, altScore, gtpScore);

  if (maxScore === astScore) return astEval;
  if (maxScore === altScore) return altEval;
  return gtpEval;
};

// 総合スコアを計算する
export const calculateTotalScore = (result: ScoringResult): number => {
  const bmiScore = getScoreFromEvaluation(result.bmi_evaluation);
  const bpScore = getScoreFromEvaluation(result.bp_evaluation);
  const glucoseScore = getScoreFromEvaluation(result.glucose_evaluation);
  const lipidScore = getScoreFromEvaluation(result.lipid_evaluation);
  const liverScore = getScoreFromEvaluation(result.liver_evaluation);

  return bmiScore + bpScore + glucoseScore + lipidScore + liverScore;
};

// CSVデータからスコアリング結果を生成する
export const generateScoringResult = (data: Record<string, string>): ScoringResult => {
  const bmi = parseFloat(data.BMI);
  const systolic = parseFloat(data.sBP);
  const diastolic = parseFloat(data.dBP);
  const bloodSugar = parseFloat(data.BS);
  const hba1c = parseFloat(data.HbA1c);
  const ldl = parseFloat(data.LDL);
  const tg = parseFloat(data.TG);
  const ast = parseFloat(data.AST);
  const alt = parseFloat(data.ALT);
  const gammaGtp = parseFloat(data.GTP); // γGTPをGTPに変更

  const bmiEval = evaluateBMI(bmi);
  const bpEval = evaluateBloodPressure(systolic, diastolic);
  const glucoseEval = evaluateGlucose(bloodSugar, hba1c);
  const lipidEval = evaluateLipid(ldl, tg);
  const liverEval = evaluateLiver(ast, alt, gammaGtp);

  const result: ScoringResult = {
    id: data.ID,
    user_id: data.ID, // IDをuser_idとしても使用
    bmi,
    bmi_evaluation: bmiEval,
    systolic_blood_pressure: systolic,
    diastolic_blood_pressure: diastolic,
    bp_evaluation: bpEval,
    blood_sugar: bloodSugar,
    hba1c,
    glucose_evaluation: glucoseEval,
    ldl_cholesterol: ldl,
    tg,
    lipid_evaluation: lipidEval,
    ast,
    alt,
    gamma_gtp: gammaGtp,
    liver_evaluation: liverEval,
    total_score: 0 // 初期値として0を設定
  };

  result.total_score = calculateTotalScore(result);
  return result;
};