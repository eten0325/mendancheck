import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const {
        timestamp,
        log_level,
        message
      } = req.body;

      // バリデーション
      if (!timestamp || !log_level || !message) {
        return res.status(400).json({ error: '必要なパラメータがありません' });
      }

      // Supabase への挿入
      const { data, error } = await supabase
        .from('logs')
        .insert([{ timestamp, log_level, message }]);

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: 'ログ書き込み中にエラーが発生しました' });
      }

      return res.status(200).json({ message: 'ログが正常に書き込まれました' });
    } catch (error: any) {
      console.error('Error writing log:', error);
      return res.status(500).json({ error: 'ログ書き込み中にエラーが発生しました' });
    }
  } else {
    res.status(405).json({ error: '許可されていないメソッドです' });
  }
}
