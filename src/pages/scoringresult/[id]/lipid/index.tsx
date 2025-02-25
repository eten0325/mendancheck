import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/supabase/types';

const LipidEvaluationDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const supabase = createClientComponentClient<Database>();
  const [lipidData, setLipidData] = useState<Database['public']['Tables']['health_check_results']['Row'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (!id) {
          console.warn('IDが存在しません。');
          return;
        }

        const { data, error } = await supabase
          .from('health_check_results')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('データ取得エラー:', error);
          setError(error.message);
        }

        if (data) {
          setLipidData(data);
        } else {
          setLipidData(null);
        }

      } catch (e: any) {
        console.error('エラー:', e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, supabase]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen h-full flex justify-center items-center">
          ローディング中...
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen h-full flex justify-center items-center">
          エラー: {error}
        </div>
      </Layout>
    );
  }

  if (!lipidData) {
    return (
      <Layout>
        <div className="min-h-screen h-full flex justify-center items-center">
          データがありません。
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen h-full bg-gray-100">
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">脂質評価詳細</h1>
          <div className="bg-white shadow-md rounded-md p-4">
            <p className="mb-2">
              <span className="font-semibold">LDLコレステロール:</span> {lipidData.ldl_cholesterol}
            </p>
            <p className="mb-2">
              <span className="font-semibold">TG:</span> {lipidData.tg}
            </p>
            <p className="mb-2">
              <span className="font-semibold">評価結果:</span> {lipidData.lipid_evaluation}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LipidEvaluationDetail;
