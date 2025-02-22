import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';

const MainMenu = () => {
  const router = useRouter();

  const handleScoringConfigClick = () => {
    router.push('/scoringconfig');
  };

  const handleScoringResultClick = () => {
    router.push('/scoringresult');
  };

  return (
    <Layout>
      <div className="min-h-screen h-full flex flex-col items-center justify-center bg-gray-100">
        <div className="bg-white shadow-md rounded-lg p-8 flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-6">メインメニュー</h1>
          <div className="flex flex-col space-y-4">
            <button
              onClick={handleScoringConfigClick}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              スコアリング設定
            </button>
            <button
              onClick={handleScoringResultClick}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              スコアリング結果一覧
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MainMenu;