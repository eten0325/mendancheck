import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from './Layout';

const Success = () => {
  const router = useRouter();

  useEffect(() => {
    // 画面遷移アニメーションなどを実装する場合はここに記述
  }, []);

  return (
    <Layout>
      <div className="min-h-screen h-full flex flex-col justify-center items-center bg-gray-100">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h1 className="block text-gray-700 text-2xl font-bold mb-2">処理完了</h1>
          <p className="block text-gray-700 text-md mb-4">CSVファイルの処理が完了しました。</p>
          <div className="flex items-center justify-between">
            <Link href="/result">
              <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                結果表示画面へ
              </a>
            </Link>
            <Link href="/main">
              <a className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                メイン画面へ
              </a>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Success;
