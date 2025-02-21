import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

const Liver = () => {
  const router = useRouter();
  const { id } = router.query;
  const [healthCheckResult, setHealthCheckResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (id) {
      fetchHealthCheckResult(id);
    }
  }, [id]);

  const fetchHealthCheckResult = async (id) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('health_check_results')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        setError('肝機能評価情報の取得に失敗しました。');
      }

      if (data) {
        setHealthCheckResult(data);
      }

      if (!data) {
        setError('肝機能評価情報はありません。');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('肝機能評価情報の取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (id) {
      fetchHealthCheckResult(id);
    }
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
        <div className="min-h-screen h-full flex flex-col items-center justify-center">
          <p className="text-red-500">{error}</p>
          <button onClick={handleRetry} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" role="button">
            リトライ
          </button>
        </div>
      </Layout>
    );
  }

  if (!healthCheckResult) {
    return (
      <Layout>
        <div className="min-h-screen h-full flex items-center justify-center">
          <p>肝機能評価情報はありません。</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen h-full p-4">
        <Link href="/scoringresult" legacyBehavior>
            <a className="flex items-center text-blue-500 hover:text-blue-700">
                <FaArrowLeft className="mr-2" />
                戻る
            </a>
        </Link>
        <h1 className="text-2xl font-bold mb-4">肝機能評価詳細</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">検査結果</h2>
            <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b">項目</th>
                  <th className="py-2 px-4 border-b">値</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td data-testid="ast-label" className="py-2 px-4 border-b">AST</td>
                  <td data-testid="ast-value" className="py-2 px-4 border-b">{healthCheckResult.ast}</td>
                </tr>
                <tr>
                  <td data-testid="alt-label" className="py-2 px-4 border-b">ALT</td>
                  <td data-testid="alt-value" className="py-2 px-4 border-b">{healthCheckResult.alt}</td>
                </tr>
                <tr>
                  <td data-testid="gamma-gtp-label" className="py-2 px-4 border-b">γGTP</td>
                  <td data-testid="gamma-gtp-value"  className="py-2 px-4 border-b">{healthCheckResult.gamma_gtp}</td>
                </tr>
              </tbody>
            </table>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">評価</h2>
            <p>肝機能評価: {healthCheckResult.liver_function_evaluation}</p>
            <p>肝機能スコア: {healthCheckResult.liver_function_score}</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mt-4 mb-2">詳細情報</h2>
          <p>ここに詳細な肝機能情報や説明を表示します。</p>
          <img src="https://placehold.co/600x300" alt="詳細情報イメージ" className="mt-4" />
        </div>
      </div>
    </Layout>
  );
};

export default Liver;