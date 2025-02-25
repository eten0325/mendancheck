import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/supabase/types';
import {ArrowLeftIcon} from '@heroicons/react/24/solid'
import Link from 'next/link';

const TopDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [healthCheckResult, setHealthCheckResult] = useState<Database['public']['Tables']['health_check_results']['Row'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          setLoading(true);
          const { data, error } = await supabase
            .from('health_check_results')
            .select('*')
            .eq('id', id)
            .single();

          if (error) {
            console.error('Supabase error:', error);
            setError('データ取得中にエラーが発生しました。');
          } else {
            setHealthCheckResult(data);
          }
        } catch (e) {
          console.error('Error fetching data:', e);
          setError('データ取得中にエラーが発生しました。');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [id, supabase]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen h-full flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen h-full flex items-center justify-center">
          <p>Error: {error}</p>
        </div>
      </Layout>
    );
  }

  if (!healthCheckResult) {
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
      <div className="min-h-screen h-full p-4">
        <div className="mb-4">
        <Link href="/topList" className="flex items-center gap-2">
            <ArrowLeftIcon className="h-5 w-5 text-blue-500"/>
            上位抽出リストに戻る
          </Link>
        </div>
        <h1 className="text-2xl font-bold mb-4">上位者詳細画面</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><strong>ID:</strong> {healthCheckResult.id}</p>
            <p><strong>BMI:</strong> {healthCheckResult.bmi}</p>
            <p><strong>BMI 評価:</strong> {healthCheckResult.bmi_evaluation}</p>
            <p><strong>収縮期血圧:</strong> {healthCheckResult.systolic_blood_pressure}</p>
            <p><strong>拡張期血圧:</strong> {healthCheckResult.diastolic_blood_pressure}</p>
            <p><strong>血圧評価:</strong> {healthCheckResult.blood_pressure_evaluation}</p>
          </div>
          <div>
            <p><strong>血糖値:</strong> {healthCheckResult.blood_sugar}</p>
            <p><strong>HbA1c:</strong> {healthCheckResult.hba1c}</p>
            <p><strong>血糖値評価:</strong> {healthCheckResult.blood_sugar_evaluation}</p>
            <p><strong>LDLコレステロール:</strong> {healthCheckResult.ldl_cholesterol}</p>
            <p><strong>トリグリセリド (TG):</strong> {healthCheckResult.tg}</p>
            <p><strong>脂質評価:</strong> {healthCheckResult.lipid_evaluation}</p>
          </div>
          <div>
            <p><strong>AST (GOT):</strong> {healthCheckResult.ast}</p>
            <p><strong>ALT (GPT):</strong> {healthCheckResult.alt}</p>
            <p><strong>γ-GTP:</strong> {healthCheckResult.gamma_gtp}</p>
            <p><strong>肝機能評価:</strong> {healthCheckResult.liver_function_evaluation}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TopDetail;