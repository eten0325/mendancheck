import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/supabase/types';
import { FaArrowLeft } from 'react-icons/fa';

const ScoringResultDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [healthCheckResult, setHealthCheckResult] = useState<Database['public']['Tables']['health_check_results']['Row'] | null>(null);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const { data, error } = await supabase
            .from('health_check_results')
            .select('*')
            .eq('id', id)
            .single();

          if (error) {
            console.error('Error fetching data:', error);
            // Fallback data in case of an error
            setHealthCheckResult({
              id: '1',
              user_id: 'エラー',
              bmi: 22.5,
              systolic_blood_pressure: 130,
              diastolic_blood_pressure: 85,
              blood_sugar: 95.0,
              hba1c: 5.8,
              ldl_cholesterol: 110.0,
              tg: 140.0,
              ast: 25,
              alt: 30,
              gamma_gtp: 35,
              bmi_score: 75,
              blood_pressure_score: 85,
              blood_sugar_score: 90,
              lipid_score: 80,
              liver_function_score: 90,
              total_score: 420,
              bmi_evaluation: 'B',
              blood_pressure_evaluation: 'C',
              blood_sugar_evaluation: 'A',
              lipid_evaluation: 'B',
              liver_function_evaluation: 'A',
              created_at: '2024-01-05T00:00:00.000Z',
              updated_at: '2024-01-05T00:00:00.000Z',
            });
          } else {
            setHealthCheckResult(data);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          // Fallback data in case of an error
           setHealthCheckResult({
              id: '1',
              user_id: 'エラーが発生しました',
              bmi: 22.5,
              systolic_blood_pressure: 130,
              diastolic_blood_pressure: 85,
              blood_sugar: 95.0,
              hba1c: 5.8,
              ldl_cholesterol: 110.0,
              tg: 140.0,
              ast: 25,
              alt: 30,
              gamma_gtp: 35,
              bmi_score: 75,
              blood_pressure_score: 85,
              blood_sugar_score: 90,
              lipid_score: 80,
              liver_function_score: 90,
              total_score: 420,
              bmi_evaluation: 'B',
              blood_pressure_evaluation: 'C',
              blood_sugar_evaluation: 'A',
              lipid_evaluation: 'B',
              liver_function_evaluation: 'A',
              created_at: '2024-01-05T00:00:00.000Z',
              updated_at: '2024-01-05T00:00:00.000Z',
            });
        }
      }
    };
    fetchData();
  }, [id, supabase]);

  if (!healthCheckResult) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="text-lg font-semibold">ロード中...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 min-h-screen h-full">
        <button
          onClick={() => router.back()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          <FaArrowLeft className="inline-block mr-2" />
          戻る
        </button>
        <h1 className="text-2xl font-bold mb-4">個別スコア詳細</h1>
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">BMI:</label>
            <p className="text-gray-800">{healthCheckResult.bmi}</p>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
              onClick={() => router.push(`/bmidetail?id=${id}`)}
            >
              BMI評価詳細
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">血圧:</label>
            <p className="text-gray-800">
              {healthCheckResult.systolic_blood_pressure} / {healthCheckResult.diastolic_blood_pressure}
            </p>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
              onClick={() => router.push(`/bpdetail?id=${id}`)}
            >
              血圧評価詳細
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">血糖値:</label>
            <p className="text-gray-800">{healthCheckResult.blood_sugar}</p>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
              onClick={() => router.push(`/glucosedetail?id=${id}`)}
            >
              血糖評価詳細
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">脂質:</label>
            <p className="text-gray-800">{healthCheckResult.ldl_cholesterol}</p>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
              onClick={() => router.push(`/lipiddetail?id=${id}`)}
            >
              脂質評価詳細
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">肝機能:</label>
            <p className="text-gray-800">
              {healthCheckResult.ast} / {healthCheckResult.alt} / {healthCheckResult.gamma_gtp}
            </p>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
              onClick={() => router.push(`/liverdetail?id=${id}`)}
            >
              肝機能評価詳細
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">総合評価:</label>
            <p className="text-gray-800">{healthCheckResult.total_score}</p>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
              onClick={() => router.push(`/totalscore?id=${id}`)}
            >
              総合評価結果
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ScoringResultDetail;