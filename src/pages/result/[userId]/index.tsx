import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Layout from '@/components/Layout';
import { Database } from '@/supabase/types';

const ResultUserId = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId') || 'defaultUserId';
  const supabase = createClientComponentClient<Database>();

  const [data, setData] = useState<Database['public']['Tables']['health_check_results']['Row'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('health_check_results')
          .select('*')
          .eq('user_id', userId);

        if (error) {
          throw new Error(error.message);
        }

        if (data && data.length > 0) {
          setData(data[0]); // Assuming you want to display the first result
        } else {
          setData(null);
        }
        setLoading(false);
      } catch (err: any) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, supabase]);

  if (loading) {
    return <Layout><div className="min-h-screen h-full flex justify-center items-center">Loading...</div></Layout>;
  }

  if (error) {
    return <Layout><div className="min-h-screen h-full flex justify-center items-center">Error: {error.message}</div></Layout>;
  }

  if (!data) {
    return <Layout><div className="min-h-screen h-full flex justify-center items-center">データがありません</div></Layout>;
  }

  return (
    <Layout>
      <div className="min-h-screen h-full py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-gray-900">詳細データ</h2>

          <div className="mt-4">
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                <li className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <span className="font-medium text-gray-900">BMI</span>
                  <span className="mt-1 text-gray-700 sm:mt-0">{data.bmi}</span>
                </li>
                <li className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <span className="font-medium text-gray-900">収縮期血圧</span>
                  <span className="mt-1 text-gray-700 sm:mt-0">{data.systolic_blood_pressure}</span>
                </li>
                <li className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <span className="font-medium text-gray-900">拡張期血圧</span>
                  <span className="mt-1 text-gray-700 sm:mt-0">{data.diastolic_blood_pressure}</span>
                </li>
                <li className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <span className="font-medium text-gray-900">血糖値</span>
                  <span className="mt-1 text-gray-700 sm:mt-0">{data.blood_sugar}</span>
                </li>
                <li className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <span className="font-medium text-gray-900">HbA1c</span>
                  <span className="mt-1 text-gray-700 sm:mt-0">{data.hba1c}</span>
                </li>
                <li className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <span className="font-medium text-gray-900">LDLコレステロール</span>
                  <span className="mt-1 text-gray-700 sm:mt-0">{data.ldl_cholesterol}</span>
                </li>
                <li className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <span className="font-medium text-gray-900">TG</span>
                  <span className="mt-1 text-gray-700 sm:mt-0">{data.tg}</span>
                </li>
                <li className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <span className="font-medium text-gray-900">AST</span>
                  <span className="mt-1 text-gray-700 sm:mt-0">{data.ast}</span>
                </li>
                <li className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <span className="font-medium text-gray-900">ALT</span>
                  <span className="mt-1 text-gray-700 sm:mt-0">{data.alt}</span>
                </li>
                <li className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <span className="font-medium text-gray-900">γ-GTP</span>
                  <span className="mt-1 text-gray-700 sm:mt-0">{data.gamma_gtp}</span>
                </li>
                <li className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <span className="font-medium text-gray-900">BMI評価</span>
                  <span className="mt-1 text-gray-700 sm:mt-0">{data.bmi_evaluation}</span>
                </li>
                <li className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <span className="font-medium text-gray-900">血圧評価</span>
                  <span className="mt-1 text-gray-700 sm:mt-0">{data.blood_pressure_evaluation}</span>
                </li>
                <li className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <span className="font-medium text-gray-900">血糖値評価</span>
                  <span className="mt-1 text-gray-700 sm:mt-0">{data.blood_sugar_evaluation}</span>
                </li>
                <li className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <span className="font-medium text-gray-900">脂質評価</span>
                  <span className="mt-1 text-gray-700 sm:mt-0">{data.lipid_evaluation}</span>
                </li>
                <li className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <span className="font-medium text-gray-900">肝機能評価</span>
                  <span className="mt-1 text-gray-700 sm:mt-0">{data.liver_function_evaluation}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResultUserId;