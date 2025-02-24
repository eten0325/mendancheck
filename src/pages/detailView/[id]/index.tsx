import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Layout from '@/components/Layout';
import Header from '@/components/Header';
import { supabase } from '@/lib/supabaseClient';

const DetailView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const id = searchParams.get('id');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          setError('IDが提供されていません。');
          setLoading(false);
          return;
        }

        const { data: healthData, error: healthError } = await supabase
          .from('health_check_results')
          .select('*')
          .eq('id', id)
          .single();

        if (healthError) {
          throw new Error(healthError.message);
        }

        if (!healthData) {
          throw new Error('データが見つかりません。');
        }

        setData(healthData);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <Layout><div className="min-h-screen h-full flex justify-center items-center">Loading...</div></Layout>;
  if (error) return  <Layout><div className="min-h-screen h-full flex justify-center items-center text-red-500">Error: {error}</div></Layout>;
  if (!data) return <Layout><div className="min-h-screen h-full flex justify-center items-center">No data found.</div></Layout>;

  return (
    <Layout>
        <Header />
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">詳細データ表示</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>ID:</strong> {data.id}</p>
              <p><strong>BMI:</strong> {data.bmi}</p>
              <p><strong>最高血圧:</strong> {data.systolic_blood_pressure}</p>
              <p><strong>最低血圧:</strong> {data.diastolic_blood_pressure}</p>
              <p><strong>血糖値:</strong> {data.blood_sugar}</p>
              <p><strong>HbA1c:</strong> {data.hba1c}</p>
            </div>
            <div>
              <p><strong>LDLコレステロール:</strong> {data.ldl_cholesterol}</p>
              <p><strong>TG:</strong> {data.tg}</p>
              <p><strong>AST:</strong> {data.ast}</p>
              <p><strong>ALT:</strong> {data.alt}</p>
              <p><strong>γ-GTP:</strong> {data.gamma_gtp}</p>
            </div>
            <div>
              <p><strong>BMI評価:</strong> {data.bmi_evaluation}</p>
              <p><strong>血圧評価:</strong> {data.blood_pressure_evaluation}</p>
              <p><strong>血糖値評価:</strong> {data.blood_sugar_evaluation}</p>
              <p><strong>脂質評価:</strong> {data.lipid_evaluation}</p>
              <p><strong>肝機能評価:</strong> {data.liver_function_evaluation}</p>
            </div>
          </div>
          <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={() => router.push('/item-detail')}
          >
            項目別詳細へ
          </button>
        </div>
    </Layout>
  );
};

export default DetailView;