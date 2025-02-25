import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/supabase/types';

export default function Input() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient<Database>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // フォームの実装は後ほど追加
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">健康診断データ入力</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* フォームの実装は後ほど追加 */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              戻る
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? '送信中...' : '送信'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
} 