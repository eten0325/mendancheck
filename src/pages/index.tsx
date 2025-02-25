import { useRouter } from 'next/router';
import Layout from '@/components/Layout';

export default function Home() {
  const router = useRouter();

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <h1 className="text-3xl font-bold text-center">健康診断評価システム</h1>
          <div className="space-y-4">
            <button
              onClick={() => router.push('/input')}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              データ入力
            </button>
            <button
              onClick={() => router.push('/scoringresult')}
              className="w-full py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              評価結果一覧
            </button>
            <button
              onClick={() => router.push('/graph')}
              className="w-full py-3 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              グラフ表示
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
