import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);



interface HealthData {
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
}

interface ScoreResult {
    bmi_score: number;
    blood_pressure_score: number;
    blood_sugar_score: number;
    lipid_score: number;
    liver_function_score: number;
    total_score: number;
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const healthData: HealthData = req.body;

            if (!healthData) {
                return res.status(400).json({ message: 'リクエストボディが必要です' });
            }

            if (typeof healthData !== 'object') {
                return res.status(400).json({ message: '無効なJSON形式です' });
            }

            // データ型の検証
            const { bmi, systolic_blood_pressure, diastolic_blood_pressure, blood_sugar, hba1c, ldl_cholesterol, tg, ast, alt, gamma_gtp } = healthData;

            if (
                typeof bmi !== 'number' ||
                typeof systolic_blood_pressure !== 'number' ||
                typeof diastolic_blood_pressure !== 'number' ||
                typeof blood_sugar !== 'number' ||
                typeof hba1c !== 'number' ||
                typeof ldl_cholesterol !== 'number' ||
                typeof tg !== 'number' ||
                typeof ast !== 'number' ||
                typeof alt !== 'number' ||
                typeof gamma_gtp !== 'number'
            ) {
                return res.status(400).json({ message: '不正なデータ型のリクエストボディです' });
            }
            
            // 必須プロパティの検証
            if (!bmi || !systolic_blood_pressure || !diastolic_blood_pressure || !blood_sugar || !hba1c || !ldl_cholesterol || !tg || !ast || !alt || !gamma_gtp) {
                return res.status(400).json({ message: '欠損したプロパティのリクエストボディです' });
            }

            // スコア計算ロジック (仮)
            const bmi_score = calculateBmiScore(bmi);
            const blood_pressure_score = calculateBloodPressureScore(systolic_blood_pressure, diastolic_blood_pressure);
            const blood_sugar_score = calculateBloodSugarScore(blood_sugar, hba1c);
            const lipid_score = calculateLipidScore(ldl_cholesterol, tg);
            const liver_function_score = calculateLiverFunctionScore(ast, alt, gamma_gtp);

            const total_score = bmi_score + blood_pressure_score + blood_sugar_score + lipid_score + liver_function_score;

            const scoreResult: ScoreResult = {
                bmi_score,
                blood_pressure_score,
                blood_sugar_score,
                lipid_score,
                liver_function_score,
                total_score,
            };

            return res.status(200).json(scoreResult);

        } catch (error) {
            console.error('Error calculating score:', error);
            return res.status(500).json({ message: 'スコアリング処理中にエラーが発生しました' });
        }
    } else {
        return res.status(405).json({ message: '許可されていないメソッドです' });
    }
}


// BMIスコア計算ロジック (仮)
function calculateBmiScore(bmi: number): number {
    if (bmi < 18.5) return 1;
    if (bmi >= 18.5 && bmi < 25) return 5;
    if (bmi >= 25 && bmi < 30) return 3;
    return 0;
}

// 血圧スコア計算ロジック (仮)
function calculateBloodPressureScore(systolic: number, diastolic: number): number {
    if (systolic < 120 && diastolic < 80) return 5;
    if (systolic >= 120 && systolic < 130 && diastolic < 80) return 3;
    if (systolic >= 130 && systolic < 140 || diastolic >= 80 && diastolic < 90) return 1;
    return 0;
}

// 血糖値スコア計算ロジック (仮)
function calculateBloodSugarScore(blood_sugar: number, hba1c: number): number {
    if (blood_sugar < 100 && hba1c < 5.7) return 5;
    if (blood_sugar >= 100 && blood_sugar < 126 && hba1c >= 5.7 && hba1c < 6.5) return 3;
    if (blood_sugar >= 126 || hba1c >= 6.5) return 1;
    return 0;
}

// 脂質スコア計算ロジック (仮)
function calculateLipidScore(ldl: number, tg: number): number {
    if (ldl < 100 && tg < 150) return 5;
    if (ldl >= 100 && ldl < 130 && tg >= 150 && tg < 200) return 3;
    if (ldl >= 130 || tg >= 200) return 1;
    return 0;
}

// 肝機能スコア計算ロジック (仮)
function calculateLiverFunctionScore(ast: number, alt: number, gtp: number): number {
    if (ast < 30 && alt < 30 && gtp < 50) return 5;
    if (ast >= 30 && ast < 40 && alt >= 30 && alt < 40 && gtp >= 50 && gtp < 80) return 3;
    if (ast >= 40 || alt >= 40 || gtp >= 80) return 1;
    return 0;
}