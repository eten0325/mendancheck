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
    
    console.log("保存データ（変更前）:", JSON.stringify(data));
    
    // 全てのnullフィールドにデフォルト値を設定
    Object.keys(data).forEach(key => {
      if (data[key] === null || data[key] === undefined) {
        if (key === 'total_score') {
          data[key] = 0;
        }
      }
    });
    
    console.log("保存データ（変更後）:", JSON.stringify(data));
    
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