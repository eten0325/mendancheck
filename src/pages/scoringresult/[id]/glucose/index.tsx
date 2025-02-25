import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '@/supabase';
import Layout from '@/components/Layout';

const GlucoseDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [healthCheckResult, setHealthCheckResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchHealthCheckResult(id);
    }
  }, [id]);

  const fetchHealthCheckResult = async (id: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('health_check_results')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      setHealthCheckResult(data);
    } catch (err: any) {
      setError(err.message);
      setHealthCheckResult({
        id: 'sample-id',
        user_id: 'sample-user',
        bmi: 24.5,
        systolic_blood_pressure: 120,
        diastolic_blood_pressure: 80,
        blood_sugar: 100,
        hba1c: 5.8,
        ldl_cholesterol: 120,
        tg: 150,
        ast: 25,
        alt: 30,
        gamma_gtp: 40,
        bmi_score: 80,
        blood_pressure_score: 90,
        blood_sugar_score: 75,
        lipid_score: 85,
        liver_function_score: 90,
        total_score: 420,
        bmi_evaluation: 'B',
        blood_pressure_evaluation: 'A',
        blood_sugar_evaluation: 'B',
        lipid_evaluation: 'C',
        liver_function_evaluation: 'A',
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Layout><div className="min-h-screen h-full flex items-center justify-center">ロード中...</div></Layout>;
  }

  if (error) {
    return <Layout><div className="min-h-screen h-full flex items-center justify-center text-red-500">エラー: {error}</div></Layout>;
  }

  if (!healthCheckResult) {
    return <Layout><div className="min-h-screen h-full flex items-center justify-center">データが見つかりません。</div></Layout>;
  }

  return (
    <Layout>
      <div className="min-h-screen h-full bg-gray-100 py-6">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-gray-50 py-4 px-6 border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-800">血糖評価詳細</h1>
          </div>

          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">基本情報</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600"><strong>ID:</strong> {healthCheckResult.id}</p>
              </div>
              <div>
                <p className="text-gray-600"><strong>ユーザーID:</strong> {healthCheckResult.user_id}</p>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-4">検査結果</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600"><strong>BMI:</strong> {healthCheckResult.bmi}</p>
                <p className="text-gray-600"><strong>BMI評価:</strong> {healthCheckResult.bmi_evaluation}</p>
                <p className="text-gray-600"><strong>BMIスコア:</strong> {healthCheckResult.bmi_score}</p>
              </div>
              <div>
                <p className="text-gray-600"><strong>血糖値:</strong> {healthCheckResult.blood_sugar}</p>
                <p className="text-gray-600"><strong>HbA1c:</strong> {healthCheckResult.hba1c}</p>
                <p className="text-gray-600"><strong>血糖値評価:</strong> {healthCheckResult.blood_sugar_evaluation}</p>
                <p className="text-gray-600"><strong>血糖値スコア:</strong> {healthCheckResult.blood_sugar_score}</p>
              </div>
              <div>
                <p className="text-gray-600"><strong>収縮期血圧:</strong> {healthCheckResult.systolic_blood_pressure}</p>
                <p className="text-gray-600"><strong>拡張期血圧:</strong> {healthCheckResult.diastolic_blood_pressure}</p>
                <p className="text-gray-600"><strong>血圧評価:</strong> {healthCheckResult.blood_pressure_evaluation}</p>
                <p className="text-gray-600"><strong>血圧スコア:</strong> {healthCheckResult.blood_pressure_score}</p>
              </div>
              <div>
                <p className="text-gray-600"><strong>LDLコレステロール:</strong> {healthCheckResult.ldl_cholesterol}</p>
                <p className="text-gray-600"><strong>中性脂肪:</strong> {healthCheckResult.tg}</p>
                <p className="text-gray-600"><strong>脂質評価:</strong> {healthCheckResult.lipid_evaluation}</p>
                 <p className="text-gray-600"><strong>脂質スコア:</strong> {healthCheckResult.lipid_score}</p>
              </div>
              <div>
                 <p className="text-gray-600"><strong>AST:</strong> {healthCheckResult.ast}</p>
                <p className="text-gray-600"><strong>ALT:</strong> {healthCheckResult.alt}</p>
                <p className="text-gray-600"><strong>γ-GTP:</strong> {healthCheckResult.gamma_gtp}</p>
                <p className="text-gray-600"><strong>肝機能評価:</strong> {healthCheckResult.liver_function_evaluation}</p>
                <p className="text-gray-600"><strong>肝機能スコア:</strong> {healthCheckResult.liver_function_score}</p>

              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-4">総合評価</h2>
            <div className="grid grid-cols-1">
              <div>
                <p className="text-gray-600"><strong>総合スコア:</strong> {healthCheckResult.total_score}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GlucoseDetailPage;
