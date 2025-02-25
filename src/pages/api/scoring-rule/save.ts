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
      
    // ...残りのコード...
  }
  // ...エラー処理...
} 