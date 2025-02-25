import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Header from '@/components/Header';
import { supabase } from '@/utils/supabaseClient';

const ScoreDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScoreData = async () => {
      try {
        setLoading(true);
        if (id) {
          const { data, error } = await supabase
            .from('health_check_results')
            .select('id, bmi_score, blood_pressure_score, blood_sugar_score, lipid_score, liver_function_score, total_score')
            .eq('id', id)
            .single();

          if (error) {
            throw error;
          }
          setScoreData(data);
        }
      } catch (err: any) {
        setError(err.message || 'スコアデータの取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchScoreData();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <Header />
        <div className="min-h-screen h-full flex items-center justify-center">
          <p>ロード中...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Header />
        <div className="min-h-screen h-full flex items-center justify-center">
          <p className="text-red-500">エラー: {error}</p>
        </div>
      </Layout>
    );
  }

  if (!scoreData) {
    return (
      <Layout>
        <Header />
        <div className="min-h-screen h-full flex items-center justify-center">
          <p>データが見つかりませんでした。</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header />
      <div className="min-h-screen h-full p-4">
        <h1 className="text-2xl font-bold mb-4">スコア詳細</h1>
        <div className="bg-white shadow rounded p-4">
          <p>ID: {scoreData.id}</p>
          <p>BMIスコア: {scoreData.bmi_score}</p>
          <p>血圧スコア: {scoreData.blood_pressure_score}</p>
          <p>血糖値スコア: {scoreData.blood_sugar_score}</p>
          <p>脂質スコア: {scoreData.lipid_score}</p>
          <p>肝機能スコア: {scoreData.liver_function_score}</p>
          <p>合計スコア: {scoreData.total_score}</p>
        </div>
        <button
          onClick={() => router.back()}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          戻る
        </button>
      </div>
    </Layout>
  );
};

export default ScoreDetail;
