import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { supabase } from '@/supabase';
import { GiBloodDrop } from 'react-icons/gi';

const BPDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [healthCheckResult, setHealthCheckResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHealthCheckResult = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!id) return;

        const { data, error } = await supabase
          .from('health_check_results')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching health check result:', error);
          setError(error.message);
        } else {
          setHealthCheckResult(data);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('データの取得中に予期せぬエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchHealthCheckResult();
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
          <p className="text-red-500">エラー: {error}</p>
        </div>
      </Layout>
    );
  }

  if (!healthCheckResult) {
    return (
      <Layout>
        <div className="min-h-screen h-full flex justify-center items-center">
          <p>データが見つかりません。</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen h-full bg-gray-100 py-6 flex flex-col justify-start items-center">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-3xl">
          <div className="flex items-center justify-center mb-6">
            <GiBloodDrop className="text-red-500 mr-2" size={32} />
            <h1 className="text-2xl font-semibold text-gray-700">血圧評価詳細</h1>
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-600 mb-2">基本情報</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">収縮期血圧:</span>
                <span className="ml-2">{healthCheckResult.systolic_blood_pressure} mmHg</span>
              </div>
              <div>
                <span className="font-medium">拡張期血圧:</span>
                <span className="ml-2">{healthCheckResult.diastolic_blood_pressure} mmHg</span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-600 mb-2">評価結果</h2>
            <div className="grid grid-cols-1">
              <div>
                <span className="font-medium">血圧評価:</span>
                <span className="ml-2">{healthCheckResult.blood_pressure_evaluation || '評価なし'}</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-600 mb-2">詳細情報</h2>
            <div className="grid grid-cols-1">
              <div>
                <span className="font-medium">詳細:</span>
                <span className="ml-2">ここに詳細情報を表示します。</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BPDetails;
