import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// utils functions
async function getLlmModelAndGenerateContent(apiName: string, systemPrompt: string, userPrompt: string): Promise<any> {
    console.log("APIリクエストをシミュレートします: ", { apiName, systemPrompt, userPrompt });

    if (apiName === 'Gemini') {
        return {
            data: {
                スコア分布: {
                    "0-20": 10,
                    "21-40": 25,
                    "41-60": 30,
                    "61-80": 20,
                    "81-100": 15
                },
                上位抽出リスト: [
                    { user_id: 'user123', total_score: 95 },
                    { user_id: 'user456', total_score: 92 },
                    { user_id: 'user789', total_score: 88 }
                ]
            }
        };
    } else if (apiName === 'Claude') {
        return {
            data: {
                評価結果一覧: [
                    { id: '1', user_id: 'user1', total_score: 75, bmi_evaluation: 'B' },
                    { id: '2', user_id: 'user2', total_score: 82, bmi_evaluation: 'A' },
                    { id: '3', user_id: 'user3', total_score: 68, bmi_evaluation: 'C' }
                ]
            }
        };
    } else if (apiName === 'ChatGPT') {
        return {
            data: {
                詳細データ: {
                    bmi: 24.5,
                    systolic_blood_pressure: 120,
                    diastolic_blood_pressure: 80,
                    blood_sugar: 95,
                    hba1c: 5.8
                }
            }
        };
    } else {
        console.error("Unknown API Name");

        // デフォルトのサンプルデータを返却
        return {
            data: {
                message: "APIリクエストに失敗しました。サンプルデータを表示します。"
            }
        };
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // 認証のサンプル
      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError) {
        console.error('認証エラー:', authError);
        return res.status(500).json({ error: '認証に失敗しました' });
      }

      console.log('現在のユーザー:', authData);

      // データベースから設定を取得するサンプル
      const { data: settings, error: settingsError } = await supabase
        .from('settings')
        .select('*');

      if (settingsError) {
        console.error('設定取得エラー:', settingsError);
        return res.status(500).json({ error: '設定の取得に失敗しました' });
      }

      console.log('設定:', settings);

      // 仮のAPIからのデータ取得
      const llmData = await getLlmModelAndGenerateContent("Gemini", "", "");

      return res.status(200).json({
        message: '設定と認証データの取得に成功しました。',
        settings,
        authData,
        llmData
      });
    } catch (error: any) {
      console.error('エラー:', error);
      return res.status(500).json({ error: '内部サーバーエラー' });
    }
  } else if (req.method === 'POST') {
    if (req.body.type === 'register') {
      try {
        const { email, password } = req.body;
        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) {
          console.error('登録エラー:', error);
          return res.status(400).json({ error: '登録に失敗しました' });
        }

        // ユーザーテーブルに情報を追加
        const { data: userData, error: userError } = await supabase
          .from('users')
          .insert([
            { id: data.user?.id, email: email }
          ]);

        if (userError) {
          console.error('ユーザーテーブルへの追加エラー:', userError);
          return res.status(500).json({ error: 'ユーザー情報の追加に失敗しました' });
        }

        return res.status(200).json({ message: '登録に成功しました' });
      } catch (error: any) {
        console.error('登録エラー:', error);
        return res.status(500).json({ error: '内部サーバーエラー' });
      }
    } else if (req.body.type === 'login') {
      try {
        const { email, password } = req.body;
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
          console.error('ログインエラー:', error);
          return res.status(401).json({ error: 'ログインに失敗しました' });
        }

        // ユーザーテーブルから情報を取得するサンプル
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user?.id)
          .single();

        if (userError) {
          console.error('ユーザー情報取得エラー:', userError);
          return res.status(500).json({ error: 'ユーザー情報の取得に失敗しました' });
        }

        return res.status(200).json({ message: 'ログインに成功しました', user });
      } catch (error: any) {
        console.error('ログインエラー:', error);
        return res.status(500).json({ error: '内部サーバーエラー' });
      }
    } else {
      return res.status(400).json({ error: '不正なリクエストです' });
    }
  } else {
    return res.status(405).json({ error: '許可されていないメソッドです' });
  }
}
