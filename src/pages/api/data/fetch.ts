import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { Database } from '@/supabase/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

type HealthCheckResult = {
  id: string;
  user_id: string;
  bmi: number | null;
  systolic_blood_pressure: number | null;
  diastolic_blood_pressure: number | null;
  blood_sugar: number | null;
  hba1c: number | null;
  ldl_cholesterol: number | null;
  tg: number | null;
  ast: number | null;
  alt: number | null;
  gamma_gtp: number | null;
  bmi_score: number | null;
  blood_pressure_score: number | null;
  blood_sugar_score: number | null;
  lipid_score: number | null;
  liver_function_score: number | null;
  total_score: number | null;
  bmi_evaluation: string | null;
  blood_pressure_evaluation: string | null;
  blood_sugar_evaluation: string | null;
  lipid_evaluation: string | null;
  liver_function_evaluation: string | null;
  created_at: string;
  updated_at: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 認証チェック
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error('認証エラー:', authError);
    return res.status(401).json({ error: '認証が必要です' });
  }

  const userId = user.id;

  switch (req.method) {
    case 'GET':
      try {
        const { data, error } = await supabase
          .from('health_check_results')
          .select('*');

        if (error) {
          console.error('データ取得エラー:', error);
          return res.status(500).json({ error: 'データベースエラー' });
        }

        res.status(200).json(data);
      } catch (err) {
        console.error('予期せぬエラー:', err);
        res.status(500).json({ error: 'サーバーエラー' });
      }
      break;

    case 'POST':
      try {
        const insertData = req.body;

        const { data, error } = await supabase
          .from('health_check_results')
          .insert([insertData])
          .select();

        if (error) {
          console.error('データ作成エラー:', error);
          return res.status(500).json({ error: '挿入エラー' });
        }
        res.status(201).json(data);
      } catch (err) {
        console.error('予期せぬエラー:', err);
        res.status(500).json({ error: 'サーバーエラー' });
      }
      break;

    case 'PUT':
      try {
        const updateData = req.body;
        const { id, ...rest } = updateData;
        const { data, error } = await supabase
          .from('health_check_results')
          .update(rest)
          .eq('id', id)
          .select();

        if (error) {
          console.error('データ更新エラー:', error);
          return res.status(500).json({ error: '更新エラー' });
        }

        if (!data || data.length === 0) {
          return res.status(404).json({ error: 'データが見つかりませんでした' });
        }

        res.status(200).json(data);
      } catch (err) {
        console.error('予期せぬエラー:', err);
        res.status(500).json({ error: 'サーバーエラー' });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.query;

        if (!id) {
          return res.status(400).json({ error: 'IDが指定されていません' });
        }

        const { data, error } = await supabase
          .from('health_check_results')
          .delete()
          .eq('id', id)
          .select();

        if (error) {
          console.error('データ削除エラー:', error);
          return res.status(500).json({ error: '削除エラー' });
        }

         if (!data || data.length === 0) {
          return res.status(404).json({ error: 'データが見つかりませんでした' });
        }

        res.status(200).json(data);
      } catch (err) {
        console.error('予期せぬエラー:', err);
        res.status(500).json({ error: 'サーバーエラー' });
      }
      break;

    default:
      res.status(405).json({ error: '許可されていないメソッドです' });
      break;
  }
}
