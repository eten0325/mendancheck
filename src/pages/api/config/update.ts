import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).end();
  }

  if (req.headers['content-type'] !== 'application/json') {
    return res.status(400).json({ error: 'Content-Typeヘッダーがapplication/jsonではありません' });
  }

  const { id, setting_key, setting_value } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'IDが提供されていません' });
  }

  if (!setting_key || !setting_value) {
    return res.status(400).json({ error: '設定キーと設定値が提供されていません' });
  }

  try {
    const { data, error } = await supabase
      .from('settings')
      .update({ setting_key: setting_key, setting_value: setting_value })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'パラメータの更新に失敗しました' });
    }

    if (!data || data.length === 0) {
        return res.status(404).json({ error: '指定されたIDの設定が見つかりませんでした' });
    }

    return res.status(200).json({ message: 'パラメータが更新されました', data: data[0] });

  } catch (err) {
    console.error('予期せぬエラー:', err);
    return res.status(500).json({ error: '予期せぬエラーが発生しました' });
  }
}
