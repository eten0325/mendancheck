import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/Layout';
import axios from 'axios';

const TotalScorePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [totalScoreData, setTotalScoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTotalScoreData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/health_check_results/${id}`);
        setTotalScoreData(response.data);
      } catch (err) {
        console.error('Error fetching total score data:', err);
        setError('データ取得に失敗しました。');
        setTotalScoreData({
            total_score: 70,
            bmi_score: 18,
            blood_pressure_score: 15,
            blood_sugar_score: 12,
            lipid_score: 8,
            liver_function_score: 17,
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTotalScoreData();
    }
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen h-full flex justify-center items-center">
          <p>ロード中...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen h-full flex justify-center items-center">
          <p>{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen h-full flex flex-col items-center p-8">
        <h1 className="text-2xl font-bold mb-4">総合評価結果</h1>
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
          <h2 className="text-lg font-semibold mb-2">総スコア</h2>
          <p className="text-gray-700">総スコア: {totalScoreData?.total_score}</p>

          <h2 className="text-lg font-semibold mt-4 mb-2">各項目のスコア</h2>
          <p className="text-gray-700">BMIスコア: {totalScoreData?.bmi_score}</p>
          <p className="text-gray-700">血圧スコア: {totalScoreData?.blood_pressure_score}</p>
          <p className="text-gray-700">血糖値スコア: {totalScoreData?.blood_sugar_score}</p>
          <p className="text-gray-700">脂質スコア: {totalScoreData?.lipid_score}</p>
          <p className="text-gray-700">肝機能スコア: {totalScoreData?.liver_function_score}</p>

          <h2 className="text-lg font-semibold mt-4 mb-2">総合評価</h2>
          <p className="text-gray-700">総合評価: {totalScoreData?.total_score > 80 ? 'A' : totalScoreData?.total_score > 60 ? 'B' : 'C'}</p>
        </div>
      </div>
    </Layout>
  );
};

export default TotalScorePage;
