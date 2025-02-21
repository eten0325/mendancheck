import React from 'react';
import Link from 'next/link';
import { Layout } from './Layout';
import Header from './Header';

const AnalysisView = () => {
  return (
    <div className="min-h-screen h-full bg-gray-100">
      <Layout>
        <Header />
        <div className="container mx-auto py-8">
          <h1 className="text-2xl font-semibold mb-4 text-gray-800">分析表示画面</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/scoreGraph" legacyBehavior>
              <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition duration-300">
                <img
                  src="https://placehold.co/600x400?text=Score+Graph"
                  alt="スコア分布グラフ"
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
                <h2 className="text-lg font-semibold text-gray-700">スコア分布グラフへ</h2>
                <p className="text-gray-500">スコアの分布を視覚的に確認できます。</p>
              </div>
            </Link>

            <Link href="/topList" legacyBehavior>
              <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition duration-300">
                <img
                  src="https://placehold.co/600x400?text=Top+List"
                  alt="上位抽出リスト"
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
                <h2 className="text-lg font-semibold text-gray-700">上位抽出リストへ</h2>
                <p className="text-gray-500">リスクの高い上位者を抽出します。</p>
              </div>
            </Link>

            <Link href="/detailView" legacyBehavior>
              <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition duration-300">
                <img
                  src="https://placehold.co/600x400?text=Detail+Data"
                  alt="詳細データ表示"
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
                <h2 className="text-lg font-semibold text-gray-700">詳細データ表示へ</h2>
                <p className="text-gray-500">個々の健康診断の詳細データを確認できます。</p>
              </div>
            </Link>

            <Link href="/evalTable" legacyBehavior>
              <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition duration-300">
                <img
                  src="https://placehold.co/600x400?text=Evaluation+Table"
                  alt="評価結果一覧"
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
                <h2 className="text-lg font-semibold text-gray-700">評価結果一覧へ</h2>
                <p className="text-gray-500">健康診断の評価結果を一覧で確認できます。</p>
              </div>
            </Link>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default AnalysisView;