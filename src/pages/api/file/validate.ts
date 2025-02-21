import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: '認証ヘッダーがありません' });
      }

      const token = authHeader.split(' ')[1];

      const { data: user, error: userError } = await supabase.auth.getUser(token);

      if (userError || !user?.user) {
        console.error('ユーザー認証エラー:', userError);
        return res.status(500).json({ message: 'ユーザー認証に失敗しました' });
      }

      const userId = user.user.id;

      const { csvData } = req.body;

      if (!csvData) {
        return res.status(400).json({ message: 'CSVデータがありません' });
      }

      const lines = csvData.split('
');
      if (lines.length < 2) {
        return res.status(400).json({ message: 'ヘッダー行とデータ行が必要です' });
      }

      const headers = lines[0].split(',');
      const dataRows = lines.slice(1);

      if (headers.length !== 12) {
          return res.status(400).json({message: 'カラム構成が不正です。必要なカラム数: 12'});
      }

      for (const row of dataRows) {
        const values = row.split(',');
        if (values.length !== headers.length) {
          return res.status(400).json({ message: '各行のデータ数がヘッダーと一致しません' });
        }

        const [bmi, systolic_blood_pressure, diastolic_blood_pressure, blood_sugar, hba1c, ldl_cholesterol, tg, ast, alt, gamma_gtp] = values.slice(1, 11);

        if (isNaN(Number(bmi)) || isNaN(Number(systolic_blood_pressure)) || isNaN(Number(diastolic_blood_pressure)) || isNaN(Number(blood_sugar)) || isNaN(Number(hba1c)) || isNaN(Number(ldl_cholesterol)) || isNaN(Number(tg)) || isNaN(Number(ast)) || isNaN(Number(alt)) || isNaN(Number(gamma_gtp))) {
          return res.status(400).json({ message: 'データ型が不正です。数値であるべきカラムに文字列が含まれています。' });
        }

        try {
          const { error: insertError } = await supabase
            .from('health_check_results')
            .insert([
              {
                user_id: userId,
                bmi: parseFloat(bmi),
                systolic_blood_pressure: parseInt(systolic_blood_pressure),
                diastolic_blood_pressure: parseInt(diastolic_blood_pressure),
                blood_sugar: parseFloat(blood_sugar),
                hba1c: parseFloat(hba1c),
                ldl_cholesterol: parseFloat(ldl_cholesterol),
                tg: parseFloat(tg),
                ast: parseInt(ast),
                alt: parseInt(alt),
                gamma_gtp: parseInt(gamma_gtp),
                bmi_score: 0,
                blood_pressure_score: 0,
                blood_sugar_score: 0,
                lipid_score: 0,
                liver_function_score: 0,
                total_score: 0,
                bmi_evaluation: 'A',
                blood_pressure_evaluation: 'A',
                blood_sugar_evaluation: 'A',
                lipid_evaluation: 'A',
                liver_function_evaluation: 'A'
              },
            ]);

          if (insertError) {
            console.error('データの挿入エラー:', insertError);
            return res.status(500).json({ message: 'データの挿入に失敗しました' });
          }
        } catch (dbError:any) {
            console.error('データベースエラー:', dbError);
            return res.status(500).json({ message: 'データベース処理中にエラーが発生しました:' + dbError.message });
        }
      }

      return res.status(200).json({ message: 'CSVデータの検証と保存に成功しました' });
    } catch (error:any) {
      console.error('エラー:', error);
      return res.status(500).json({ message: 'サーバーエラーが発生しました:' + error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: '認証ヘッダーがありません' });
      }

      const token = authHeader.split(' ')[1];
      const { data: user, error: userError } = await supabase.auth.getUser(token);

      if (userError || !user?.user) {
        console.error('ユーザー認証エラー:', userError);
        return res.status(500).json({ message: 'ユーザー認証に失敗しました' });
      }

      return res.status(200).json({ message: '認証成功' });
    } catch (error:any) {
      console.error('エラー:', error);
      return res.status(500).json({ message: 'サーバーエラーが発生しました:' + error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).send('Method Not Allowed');
  }
}
