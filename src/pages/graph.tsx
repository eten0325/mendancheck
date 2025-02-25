import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/supabase/types';
import { useRouter } from 'next/router';

const Graph = () => {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('health_check_results')
          .select('*');

        if (error) throw error;
        
        // データ処理ロジックをここに追加
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen h-full flex justify-center items-center">
          Loading...
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen h-full flex justify-center items-center">
          Error: {error}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">グラフ表示</h1>
        {/* グラフコンポーネントをここに追加 */}
        <button
          onClick={() => router.push('/')}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          戻る
        </button>
      </div>
    </Layout>
  );
};

export default Graph; 