import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { data, error } = await supabase
      .from('health_check_results')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }

    // CSVヘッダー
    const headers = [
      'ID',
      'BMI',
      'BMI評価',
      '収縮期血圧',
      '拡張期血圧',
      '血圧評価',
      '血糖値',
      'HbA1c',
      '血糖評価',
      'LDLコレステロール',
      'TG',
      '脂質評価',
      'AST',
      'ALT',
      'γGTP',
      '肝機能評価',
      '総合スコア',
      '作成日時'
    ].join(',');

    // CSVデータ行の生成
    const rows = data.map(record => [
      record.id,
      record.bmi,
      record.bmi_evaluation,
      record.systolic_blood_pressure,
      record.diastolic_blood_pressure,
      record.bp_evaluation,
      record.blood_sugar,
      record.hba1c,
      record.glucose_evaluation,
      record.ldl_cholesterol,
      record.tg,
      record.lipid_evaluation,
      record.ast,
      record.alt,
      record.gamma_gtp,
      record.liver_evaluation,
      record.total_score,
      record.created_at
    ].join(','));

    // CSVデータの組み立て
    const csv = [headers, ...rows].join('\n');

    // CSVファイルとしてダウンロード
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=health_check_results.csv');
    return res.status(200).send(csv);

  } catch (error: any) {
    console.error('Error generating download:', error);
    return res.status(500).json({
      message: 'Error generating download',
      error: error.message
    });
  }
}
