import React, { useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const Menu = () => {
  const router = useRouter() as any;

  const fetchUser = useCallback(async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">メニュー</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* データアップロード */}
            <div className="bg-white overflow-hidden shadow-sm rounded-lg hover:shadow-md transition-shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">データアップロード</h3>
                <p className="text-sm text-gray-500 mb-4">
                  健康診断データのCSVファイルをアップロードし、評価を実施します。
                </p>
                <button
                  onClick={() => router.push('/fileUpload')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  アップロードへ
                </button>
              </div>
            </div>

            {/* 結果閲覧 */}
            <div className="bg-white overflow-hidden shadow-sm rounded-lg hover:shadow-md transition-shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">結果閲覧</h3>
                <p className="text-sm text-gray-500 mb-4">
                  評価済みデータの結果を閲覧します。グラフや詳細な分析が確認できます。
                </p>
                <button
                  onClick={() => router.push('/result')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  結果を見る
                </button>
              </div>
            </div>

            {/* 設定 */}
            <div className="bg-white overflow-hidden shadow-sm rounded-lg hover:shadow-md transition-shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">設定</h3>
                <p className="text-sm text-gray-500 mb-4">
                  評価基準やシステムの設定を変更します。
                </p>
                <button
                  onClick={() => router.push('/settings')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  設定を開く
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Menu;
