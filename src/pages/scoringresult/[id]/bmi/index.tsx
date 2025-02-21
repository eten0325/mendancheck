import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Layout } from '@/components/Layout';
import { supabase } from '@/supabase';

const BMIDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [bmiData, setBmiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchBmiData(id);
    }
  }, [id]);

  const fetchBmiData = async (id) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('health_check_results')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      setBmiData(data);
    } catch (err) {
      setError(err.message || 'データの取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    router.push('/scoringresult');
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen h-full flex items-center justify-center">
          <p>ロード中...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen h-full flex items-center justify-center">
          <p className="text-red-500">エラー: {error}</p>
        </div>
      </Layout>
    );
  }

  if (!bmiData) {
    return (
      <Layout>
        <div className="min-h-screen h-full flex items-center justify-center">
          <p>データが見つかりません。</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen h-full bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <div>
                <h1 className="text-2xl font-semibold">BMI評価詳細</h1>
              </div>
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <p>BMI値: {bmiData.bmi}</p>
                  <p>評価結果: {bmiData.bmi_evaluation}</p>
                  <p>詳細情報:</p>
                  <ul>
                    <li>ユーザーID: {bmiData.user_id}</li>
                    <li>作成日: {new Date(bmiData.created_at).toLocaleDateString()}</li>
                    <li>更新日: {new Date(bmiData.updated_at).toLocaleDateString()}</li>
                  </ul>
                </div>
                <div className="pt-6 text-base font-semibold leading-6 sm:text-lg sm:leading-7">
                  <button
                    onClick={goBack}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                  >
                    戻る
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BMIDetail;
