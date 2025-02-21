import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FaCog, FaHome, FaList, FaFileAlt } from 'react-icons/fa';

const Header = () => (
  <header className="bg-blue-500 text-white p-4">
    <h1 className="text-2xl font-bold">健康診断結果分析システム</h1>
  </header>
);

const Footer = () => (
  <footer className="bg-gray-200 text-gray-600 p-4 text-center">
    <p>&copy; 2025 健康診断結果分析システム</p>
  </footer>
);

const Sidebar = () => {
  const router = useRouter();

  return (
    <div className="bg-gray-100 p-4 w-64 min-h-screen">
      <h2 className="text-lg font-semibold mb-4">メニュー</h2>
      <ul>
        <li className="mb-2">
          <button onClick={() => router.push('/')} className="flex items-center hover:bg-gray-300 p-2 rounded w-full text-left">
            <FaHome className="mr-2" /> ホーム
          </button>
        </li>
        <li className="mb-2">
          <button onClick={() => router.push('/analysis')} className="flex items-center hover:bg-gray-300 p-2 rounded w-full text-left">
            <FaList className="mr-2" /> 分析結果
          </button>
        </li>
        <li className="mb-2">
          <button onClick={() => router.push('/extract')} className="flex items-center hover:bg-gray-300 p-2 rounded w-full text-left">
            <FaFileAlt className="mr-2" /> 上位抽出
          </button>
        </li>
        <li className="mb-2">
          <button onClick={() => router.push('/settings')} className="flex items-center hover:bg-gray-300 p-2 rounded w-full text-left">
            <FaCog className="mr-2" /> 設定
          </button>
        </li>
      </ul>
    </div>
  );
};

const Extract = () => {
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchTopUsers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('health_check_results')
          .select('user_id, total_score')
          .order('total_score', { ascending: false })
          .limit(10);

        if (error) {
          console.error('Supabase error:', error);
          setError('データ取得に失敗しました。');
          setTopUsers([
            { user_id: 'サンプル1', total_score: 120 },
            { user_id: 'サンプル2', total_score: 110 },
            { user_id: 'サンプル3', total_score: 100 }
          ]);
        } else {
          setTopUsers(data || []);
        }
      } catch (e: any) {
        console.error('Error fetching data:', e);
        setError('データ取得中にエラーが発生しました。');
          setTopUsers([
            { user_id: 'サンプル1', total_score: 120 },
            { user_id: 'サンプル2', total_score: 110 },
            { user_id: 'サンプル3', total_score: 100 }
          ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopUsers();
  }, [supabase]);

  return (
    <div className="flex flex-col min-h-screen h-full">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4">
          <h1 className="text-2xl font-semibold mb-4">上位抽出画面</h1>
          {loading && <p>ロード中...</p>}
          {error && <p className="text-red-500">エラー: {error}</p>}
          {!loading && !error && (
            <div>
              <h2 className="text-lg font-semibold mb-2">総スコア上位の対象者</h2>
              {topUsers.length > 0 ? (
                <ul className="list-disc pl-5">
                  {topUsers.map((user) => (
                    <li key={user.user_id}>
                      ユーザーID: {user.user_id}, スコア: {user.total_score}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>上位対象者はいません。</p>
              )}
              <button
                onClick={() => router.push('/settings')}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
              >
                設定画面へ
              </button>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Extract;