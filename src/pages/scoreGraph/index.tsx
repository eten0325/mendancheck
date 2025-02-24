import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ScoreData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
  }[];
}

const ScoreGraph = () => {
  const router = useRouter() as any;
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchScoreData = useCallback(async () => {
    try {
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (authError || !session) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('health_check_results')
        .select('total_score')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      if (data) {
        const scores = data.map(item => item.total_score);
        const labels = Array.from({ length: scores.length }, (_, i) => `データ${i + 1}`);

        setScoreData({
          labels,
          datasets: [
            {
              label: '総合スコア',
              data: scores,
              backgroundColor: Array(scores.length).fill('rgba(54, 162, 235, 0.5)'),
            },
          ],
        });
      }
    } catch (error) {
      console.error('Error fetching score data:', error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchScoreData();
  }, [fetchScoreData]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">スコア分布グラフ</h2>
              {scoreData ? (
                <div className="relative h-96">
                  {/* グラフ表示エリア */}
                  <div className="absolute inset-0">
                    {/* ここにグラフライブラリを使用してグラフを描画 */}
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center h-96">
                  <p className="text-gray-500">データが見つかりません</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ScoreGraph;
