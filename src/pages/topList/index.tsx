import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Layout } from './Layout';
import { Header } from './Header';

const TopList = () => {
  const [userIds, setUserIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('extracted_ids')
          .select('user_id, total_score')
          .order('total_score', { ascending: false });

        if (error) {
          console.error('Supabaseからデータを取得できませんでした:', error);
          // エラー発生時のサンプルデータ
          setUserIds(['user1', 'user2', 'user3']);
        } else {
          if (data && Array.isArray(data)) {
            setUserIds(data.map((item) => item.user_id));
          } else {
            console.warn('No data received from Supabase or data is not an array.');
            setUserIds([]);
          }
        }
      } catch (error) {
        console.error('データの取得中にエラーが発生しました:', error);
        // エラー発生時のサンプルデータ
        setUserIds(['userA', 'userB', 'userC']);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  const handleLinkClick = (userId: string) => {
    router.push(`/detail/${userId}`);
  };

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <Layout>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-semibold mb-4">上位抽出リスト画面</h1>
          {loading ? (
            <p>Loading...</p>
          ) : userIds.length === 0 ? (
            <p>データがありません。</p>
          ) : (
            <ul className="list-disc pl-5">
              {userIds.map((userId) => (
                <li key={userId} className="mb-2">
                  <button
                    onClick={() => handleLinkClick(userId)}
                    className="text-blue-600 hover:underline"
                  >
                    {userId}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </main>
      </Layout>
    </div>
  );
};

export default TopList;