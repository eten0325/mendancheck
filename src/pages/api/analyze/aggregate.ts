import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

type ScoreDistribution = {
  range: string;
  count: number;
}[];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { data, error } = await supabase
      .from('health_check_results')
      .select('id, total_score');

    if (error) {
      console.error('Supabaseからデータ取得エラー:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (!data) {
        return res.status(500).json({error: 'Internal Server Error'});
    }

    // データがない場合のデフォルトの分布データ
    if (data.length === 0) {
      const defaultDistribution: ScoreDistribution = [
        { range: '0-49', count: 0 },
        { range: '50-99', count: 0 },
        { range: '100-149', count: 0 },
        { range: '150-199', count: 0 },
        { range: '200+', count: 0 },
      ];
      return res.status(200).json(defaultDistribution);
    }

    const distribution: ScoreDistribution = [
      { range: '0-49', count: 0 },
      { range: '50-99', count: 0 },
      { range: '100-149', count: 0 },
      { range: '150-199', count: 0 },
      { range: '200+', count: 0 },
    ];

    data.forEach((result) => {
        const totalScore = typeof result.total_score === 'number' ? result.total_score : parseInt(result.total_score, 10);
      if (isNaN(totalScore)) {
        console.error(`無効なスコア値: ${result.total_score}`);
        throw new Error("Invalid score value encountered during aggregation.");
      }

      if (totalScore >= 0 && totalScore <= 49) {
        distribution[0].count++;
      } else if (totalScore >= 50 && totalScore <= 99) {
        distribution[1].count++;
      } else if (totalScore >= 100 && totalScore <= 149) {
        distribution[2].count++;
      } else if (totalScore >= 150 && totalScore <= 199) {
        distribution[3].count++;
      } else {
        distribution[4].count++;
      }
    });

    return res.status(200).json(distribution);
  } catch (error: any) {
    console.error('エラー:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
