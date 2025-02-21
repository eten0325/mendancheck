import React from 'react';
import Layout from '../app/Layout';
import Header from '../app/Header';
import { useRouter } from 'next/router';

const ErrorPage = () => {
  const router = useRouter();

  return (
    <Layout>
      <Header />
      <div className="min-h-screen h-full flex flex-col items-center justify-center bg-gray-100">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h1 className="text-red-500 text-2xl font-bold mb-4">エラーが発生しました</h1>
          <p className="text-gray-700 text-base mb-4">システムエラーが発生しました。もう一度お試しください。</p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => {
              // 再試行処理 (例：リロード)
              window.location.reload();
            }}
          >
            再試行
          </button>
          <button
            className="ml-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => {
              router.push('/');
            }}
          >
            メイン画面へ
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ErrorPage;