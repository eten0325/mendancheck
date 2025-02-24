import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface LiverResult {
  ast: number;
  alt: number;
  gtp: number;
  evaluation: string;
}

const LiverResultPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [result, setResult] = useState<LiverResult | null>(null);

  const fetchHealthCheckResult = useCallback(async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('health_check_results')
        .select('ast, alt, gtp, liver_evaluation')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setResult({
          ast: data.ast,
          alt: data.alt,
          gtp: data.gtp,
          evaluation: data.liver_evaluation,
        });
      }
    } catch (error) {
      console.error('Error fetching health check result:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchHealthCheckResult();
  }, [fetchHealthCheckResult]);

  if (!result) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">肝機能検査結果</h2>
                <Image
                  src="/icons/liver.png"
                  alt="肝機能"
                  width={32}
                  height={32}
                  className="text-gray-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* AST */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">AST</h3>
                  <div className="text-3xl font-bold text-indigo-600 mb-2">
                    {result.ast} <span className="text-sm text-gray-500">U/L</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      style={{ width: `${(result.ast / 50) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* ALT */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">ALT</h3>
                  <div className="text-3xl font-bold text-indigo-600 mb-2">
                    {result.alt} <span className="text-sm text-gray-500">U/L</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      style={{ width: `${(result.alt / 50) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* γ-GTP */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">γ-GTP</h3>
                  <div className="text-3xl font-bold text-indigo-600 mb-2">
                    {result.gtp} <span className="text-sm text-gray-500">U/L</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      style={{ width: `${(result.gtp / 100) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* 総合評価 */}
              <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">総合評価</h3>
                <div className="flex items-center">
                  <div className={`text-2xl font-bold ${
                    result.evaluation === 'A' ? 'text-green-600' :
                    result.evaluation === 'B' ? 'text-yellow-600' :
                    result.evaluation === 'C' ? 'text-orange-600' :
                    'text-red-600'
                  }`}>
                    {result.evaluation}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">
                      {result.evaluation === 'A' ? '正常範囲内です。現在の生活習慣を維持してください。' :
                       result.evaluation === 'B' ? '軽度の異常が見られます。生活習慣の見直しを検討してください。' :
                       result.evaluation === 'C' ? '中程度の異常が見られます。専門医への相談をお勧めします。' :
                       '重度の異常が見られます。至急専門医の診察を受けてください。'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LiverResultPage;