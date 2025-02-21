import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Session } from '@supabase/supabase-js';
import { FaChartBar, FaList, FaSortAmountUp } from 'react-icons/fa';

const Result = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [healthData, setHealthData] = useState<any[]>([]);
  const router = useRouter();

  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        // Fetch health data from Supabase
        const { data, error } = await supabase
          .from('health_check_results')
          .select('*');

        if (error) {
          console.error('Error fetching health data:', error);
          // Provide sample data in case of error
          setHealthData([
            {
              id: 'sample-1',
              user_id: 'user123',
              bmi: 24.5,
              systolic_blood_pressure: 120,
              diastolic_blood_pressure: 80,
              blood_sugar: 95,
              hba1c: 5.8,
              ldl_cholesterol: 110,
              tg: 150,
              ast: 25,
              alt: 30,
              gamma_gtp: 40,
              bmi_score: 80,
              blood_pressure_score: 90,
              blood_sugar_score: 85,
              lipid_score: 75,
              liver_function_score: 95,
              total_score: 425,
              bmi_evaluation: 'B',
              blood_pressure_evaluation: 'A',
              blood_sugar_evaluation: 'B',
              lipid_evaluation: 'C',
              liver_function_evaluation: 'A',
              created_at: new Date(),
              updated_at: new Date(),
            },
            {
              id: 'sample-2',
              user_id: 'user456',
              bmi: 28.0,
              systolic_blood_pressure: 130,
              diastolic_blood_pressure: 85,
              blood_sugar: 105,
              hba1c: 6.2,
              ldl_cholesterol: 130,
              tg: 180,
              ast: 35,
              alt: 40,
              gamma_gtp: 50,
              bmi_score: 70,
              blood_pressure_score: 80,
              blood_sugar_score: 75,
              lipid_score: 65,
              liver_function_score: 85,
              total_score: 375,
              bmi_evaluation: 'C',
              blood_pressure_evaluation: 'B',
              blood_sugar_evaluation: 'C',
              lipid_evaluation: 'D',
              liver_function_evaluation: 'B',
              created_at: new Date(),
              updated_at: new Date(),
            },
          ]);
        } else {
          setHealthData(data || []);
        }
      }
    };

    fetchData();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md">
          <h2 className="text-2xl font-semibold mb-4">ログインしてください</h2>
          <button onClick={() => router.push('/login')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            ログイン画面へ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">分析結果画面</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            ログアウト
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-200 h-screen py-8 px-3">
          <nav className="flex flex-col">
            <h2 className="font-bold text-lg mb-4">ナビゲーション</h2>
            <button
              onClick={() => router.push('/')}
              className="py-2 px-4 rounded hover:bg-gray-300 text-left"
            >
              アップロード画面
            </button>
            <button
              onClick={() => router.push('/result')}
              className="py-2 px-4 rounded hover:bg-gray-300 text-left"
            >
              分析結果画面
            </button>
            <button
              onClick={() => router.push('/settings')}
              className="py-2 px-4 rounded hover:bg-gray-300 text-left"
            >
              設定画面
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 py-8 px-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">健康診断結果</h2>
            <p className="text-gray-700">アップロードされたCSVファイルの分析結果を表示します。</p>
          </div>

          {/* コンポーネント表示 */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-3 flex items-center"><FaChartBar className="mr-2" />グラフ表示コンポーネント</h3>
            <img src="https://placehold.co/600x300" alt="グラフのプレースホルダー" className="rounded shadow" />
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-3 flex items-center"><FaList className="mr-2" />評価結果一覧コンポーネント</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded shadow-md">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ユーザーID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BMI</th>
                    {/* 他のカラムもここに追加 */}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {healthData.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.user_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.bmi}</td>
                      {/* 他のカラムもここに追加 */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3 flex items-center"><FaSortAmountUp className="mr-2" />上位抽出コンポーネント</h3>
            <img src="https://placehold.co/600x300" alt="上位抽出のプレースホルダー" className="rounded shadow" />
          </section>
        </main>
      </div>

      <footer className="bg-white shadow py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500">© 2025 健康診断結果分析システム</p>
        </div>
      </footer>
    </div>
  );
};

export default Result;
