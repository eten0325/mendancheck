import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

type HealthCheckResult = {
  id: string;
  user_id: string;
  total_score: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const percentage = req.body.percentage;

      if (percentage === undefined) {
        return res.status(400).json({ message: '上位抽出割合が指定されていません' });
      }

      if (typeof percentage !== 'number') {
        return res.status(400).json({ message: '上位抽出割合は数値で指定してください' });
      }

      if (percentage < 0 || percentage > 1) {
        return res.status(400).json({ message: '上位抽出割合は0から1の間の数値を指定してください' });
      }

      // 1. Get all health check results.
      const { data: healthCheckResults, error: healthCheckResultsError } = await supabase
        .from('health_check_results')
        .select('id, user_id, total_score');

      if (healthCheckResultsError) {
        console.error('Supabaseから健康診断結果の取得に失敗しました:', healthCheckResultsError);
        return res.status(500).json({ message: '健康診断結果の取得に失敗しました' });
      }

      if (!healthCheckResults || healthCheckResults.length === 0) {
        return res.status(200).json({ message: '健康診断結果が存在しません' });
      }

      // 2. Sort by total score in descending order.
      const sortedResults = healthCheckResults.sort((a, b) => b.total_score - a.total_score);

      // 3. Extract the top N based on the given percentage.
      const numberOfResultsToExtract = Math.max(1, Math.floor(sortedResults.length * percentage));
      const topNResults = sortedResults.slice(0, numberOfResultsToExtract);

      // 4. Clear existing extracted IDs
      const { error: deleteError } = await supabase
        .from('extracted_ids')
        .delete()
        .neq('user_id', '');

      if (deleteError) {
        console.error('既存の抽出IDの削除に失敗しました:', deleteError);
        return res.status(500).json({ message: '既存の抽出IDの削除に失敗しました' });
      }

      // 5. Insert top N results into the extracted_ids table.
      const extractedIdsToInsert = topNResults.map(result => ({
        user_id: result.user_id,
        total_score: result.total_score,
      }));

      const { error: insertError } = await supabase
        .from('extracted_ids')
        .insert(extractedIdsToInsert);

      if (insertError) {
        console.error('上位抽出結果の挿入に失敗しました:', insertError);
        return res.status(500).json({ message: '上位抽出結果の挿入に失敗しました' });
      }

      return res.status(200).json({ message: '上位抽出処理が実行されました。' });
    } catch (error) {
      console.error('上位抽出処理中にエラーが発生しました:', error);
      return res.status(500).json({ message: '上位抽出処理中にエラーが発生しました' });
    }
  } else if (req.method === 'GET') {
    return res.status(200).json({ message: '上位抽出処理が実行されました。' });
  } else {
    return res.status(405).json({ message: '許可されていないメソッドです' });
  }
}
