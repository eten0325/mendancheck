import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    const data = req.body;
    
    // total_scoreが存在しない場合はデフォルト値を設定
    if (data.total_score === undefined || data.total_score === null) {
      // 必要に応じてスコアを計算する
      // 例：各評価項目のスコアの合計など
      data.total_score = 0;  // または適切な計算値
    }
    
    const { data: result, error } = await supabase
      .from('health_check_results')
      .insert(data);
      
    if (error) {
      throw error;
    }
    
    return res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    console.error('データ保存エラー:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'データの保存に失敗しました' 
    });
  }
} 