import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const scoringRule = req.body;

      if (!scoringRule) {
        return res.status(400).json({ error: 'リクエストボディがありません。' });
      }

      if (!scoringRule.id) {
          return res.status(400).json({ error: 'スコアリングルールのIDがありません。' });
      }

      const { data, error } = await supabase
        .from('settings')
        .upsert(scoringRule);

      if (error) {
        console.error('Supabaseへの保存エラー:', error);
        return res.status(500).json({ error: 'スコアリングルールの保存中にエラーが発生しました。' });
      }

      return res.status(200).json({ message: 'スコアリングルールを保存しました。' });
    } catch (error: any) {
      console.error('サーバーエラー:', error);
      return res.status(500).json({ error: 'サーバーエラーが発生しました。' });
    }
  } else {
    return res.status(405).send('Method Not Allowed');
  }
}
