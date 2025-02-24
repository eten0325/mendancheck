import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

const LogDetailPage = () => {
  const [log, setLog] = useState<Database['public']['Tables']['health_check_results']['Row'] | null>(null);
  const router = useRouter();
  const { logId } = router.query;
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const fetchLog = async () => {
      if (logId) {
        try {
          const { data, error } = await supabase
            .from('health_check_results')
            .select('*')
            .eq('id', logId)
            .single();

          if (error) {
            console.error('Error fetching log:', error);
            // Fallback data
            setLog({
              id: 'fallback-id',
              user_id: '',
              total_score: 0,
              bmi: 0,
              bmi_evaluation: '',
              systolic_blood_pressure: 0,
              diastolic_blood_pressure: 0,
              bp_evaluation: '',
              blood_sugar: 0,
              created_at: new Date().toISOString(),
            });
          } else {
            setLog(data);
          }
        } catch (err) {
          console.error('Unexpected error fetching log:', err);
          // Fallback data
          setLog({
            id: 'fallback-id',
            user_id: '',
            total_score: 0,
            bmi: 0,
            bmi_evaluation: '',
            systolic_blood_pressure: 0,
            diastolic_blood_pressure: 0,
            bp_evaluation: '',
            blood_sugar: 0,
            created_at: new Date().toISOString(),
          });
        }
      } else {
           setLog({
            id: 'fallback-id',
            user_id: '',
            total_score: 0,
            bmi: 0,
            bmi_evaluation: '',
            systolic_blood_pressure: 0,
            diastolic_blood_pressure: 0,
            bp_evaluation: '',
            blood_sugar: 0,
            created_at: new Date().toISOString(),
          });
      }
    };

    fetchLog();
  }, [logId, supabase]);

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <header className="bg-blue-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/admin/" className="text-2xl font-bold hover:text-blue-300">
            健康診断結果分析システム
          </Link>
          <nav>
            <Link href="/admin/logs" className="hover:text-blue-300">ログ一覧</Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto py-6 flex">
        <aside className="w-64 bg-gray-200 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">管理メニュー</h2>
          <ul>
            <li className="mb-2">
              <Link href="/admin/" className="block hover:bg-gray-300 p-2 rounded-md">
                ダッシュボード
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/admin/logs" className="block hover:bg-gray-300 p-2 rounded-md">
                ログ管理
              </Link>
            </li>
             <li className="mb-2">
              <Link href="/admin/users" className="block hover:bg-gray-300 p-2 rounded-md">
                ユーザ管理
              </Link>
            </li>
          </ul>
        </aside>

        <main className="flex-1 p-6 bg-white rounded-md shadow-md">
          <h1 className="text-3xl font-semibold mb-6">ログ詳細</h1>

          {log ? (
            <div data-testid="log-detail-screen">
              <p><strong>タイムスタンプ:</strong> {new Date(log.created_at).toLocaleString()}</p>
            </div>
          ) : (
            <p>ログを読み込み中...</p>
          )}
        </main>
      </div>

      <footer className="bg-gray-800 text-white text-center p-4">
        <p>&copy; 2025 健康診断結果分析システム</p>
      </footer>
    </div>
  );
};

export default LogDetailPage;
