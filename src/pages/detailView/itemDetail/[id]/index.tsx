import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '../../components/Layout';
import { Header } from '../../components/Header';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const ItemDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [healthData, setHealthData] = useState(null);
  const supabase = createClientComponentClient();

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
            // Set sample data in case of an error
            setHealthData({
              id: 'サンプルID',
              bmi: 24.5,
              systolic_blood_pressure: 125,
              diastolic_blood_pressure: 80,
              blood_sugar: 95,
              hba1c: 5.8,
              ldl_cholesterol: 120,
              tg: 150,
              ast: 25,
              alt: 30,
              gamma_gtp: 40,
              bmi_evaluation: '普通',
              blood_pressure_evaluation: '正常',
              blood_sugar_evaluation: '正常',
              lipid_evaluation: '注意',
              liver_function_evaluation: '正常',
            });
          } else {
            setHealthData(data);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          // Set sample data in case of an error
          setHealthData({
            id: 'サンプルID',
            bmi: 24.5,
            systolic_blood_pressure: 125,
            diastolic_blood_pressure: 80,
            blood_sugar: 95,
            hba1c: 5.8,
            ldl_cholesterol: 120,
            tg: 150,
            ast: 25,
            alt: 30,
            gamma_gtp: 40,
            bmi_evaluation: '普通',
            blood_pressure_evaluation: '正常',
            blood_sugar_evaluation: '正常',
            lipid_evaluation: '注意',
            liver_function_evaluation: '正常',
          });
        }
      }
    };

    fetchData();
  }, [id, supabase]);

  if (!healthData) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <Header />
      <div className="min-h-screen h-full bg-gray-100">
        <div className="container mx-auto py-6">
          <h1 className="text-2xl font-semibold mb-4">項目別詳細画面</h1>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
            onClick={() => router.push('/')}
          >
            メインメニューに戻る
          </button>

          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-xl font-semibold mb-4">健康診断結果</h2>
            <p className="mb-2">
              <span className="font-bold">ID:</span> {healthData.id}
            </p>
            <p className="mb-2">
              <span className="font-bold">BMI:</span> {healthData.bmi}
            </p>
            <p className="mb-2">
              <span className="font-bold">収縮期血圧:</span> {healthData.systolic_blood_pressure}
            </p>
            <p className="mb-2">
              <span className="font-bold">拡張期血圧:</span> {healthData.diastolic_blood_pressure}
            </p>
            <p className="mb-2">
              <span className="font-bold">血糖値:</span> {healthData.blood_sugar}
            </p>
            <p className="mb-2">
              <span className="font-bold">HbA1c:</span> {healthData.hba1c}
            </p>
            <p className="mb-2">
              <span className="font-bold">LDLコレステロール:</span> {healthData.ldl_cholesterol}
            </p>
            <p className="mb-2">
              <span className="font-bold">TG:</span> {healthData.tg}
            </p>
            <p className="mb-2">
              <span className="font-bold">AST:</span> {healthData.ast}
            </p>
            <p className="mb-2">
              <span className="font-bold">ALT:</span> {healthData.alt}
            </p>
            <p className="mb-2">
              <span className="font-bold">γ-GTP:</span> {healthData.gamma_gtp}
            </p>
            <p className="mb-2">
              <span className="font-bold">BMI評価:</span> {healthData.bmi_evaluation}
            </p>
            <p className="mb-2">
              <span className="font-bold">血圧評価:</span> {healthData.blood_pressure_evaluation}
            </p>
            <p className="mb-2">
              <span className="font-bold">血糖値評価:</span> {healthData.blood_sugar_evaluation}
            </p>
            <p className="mb-2">
              <span className="font-bold">脂質評価:</span> {healthData.lipid_evaluation}
            </p>
            <p className="mb-2">
              <span className="font-bold">肝機能評価:</span> {healthData.liver_function_evaluation}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ItemDetail;