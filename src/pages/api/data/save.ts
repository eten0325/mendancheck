import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

type HealthCheckResult = {
  id?: string;
  userId: string;
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
  bmi_evaluation: string;
  blood_pressure_evaluation: string;
  blood_sugar_evaluation: string;
  lipid_evaluation: string;
  liver_function_evaluation: string;
  created_at?: string;
  updated_at?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { user } = await supabase.auth.getUser();

      if (!user) {
        return res.status(401).json({ error: '認証が必要です' });
      }

      // JSON形式の検証
      if (typeof req.body !== 'object') {
        return res.status(400).json({ error: '無効なJSON形式です' });
      }

      const healthCheckResult: HealthCheckResult = req.body;

      // 必須フィールドの検証
      const requiredFields = [
        'userId',
        'bmi',
        'systolic_blood_pressure',
        'diastolic_blood_pressure',
        'blood_sugar',
        'hba1c',
        'ldl_cholesterol',
        'tg',
        'ast',
        'alt',
        'gamma_gtp',
        'bmi_score',
        'blood_pressure_score',
        'blood_sugar_score',
        'lipid_score',
        'liver_function_score',
        'total_score',
        'bmi_evaluation',
        'blood_pressure_evaluation',
        'blood_sugar_evaluation',
        'lipid_evaluation',
        'liver_function_evaluation',
      ];

      for (const field of requiredFields) {
        if (!(field in healthCheckResult)) {
          return res.status(400).json({
            error: `${field}は必須フィールドです`,
          });
        }
      }

      const { data, error } = await supabase
        .from('health_check_results')
        .insert([healthCheckResult]);

      if (error) {
        console.error('Supabaseへの挿入エラー:', error);
        return res.status(500).json({ error: 'データベースエラーが発生しました' });
      }

      return res.status(200).json({ message: 'データは正常に保存されました。' });
    } catch (error: any) {
      console.error('サーバーエラー:', error);
      return res.status(500).json({ error: '予期せぬエラーが発生しました' });
    }
  } else {
    return res.status(405).json({ error: '許可されていないメソッドです' });
  }
}
