import React from 'react';
import Layout from '@/components/Layout';
import Header from '@/components/Header';
import { useRouter } from 'next/router';

const ErrorPage = () => {
  const router = useRouter();
  const { error } = router.query;

  return (
    <Layout>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">エラーが発生しました。</h1>
          <p className="text-gray-600 mb-4">{error || 'エラーの詳細は提供されていません。'}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            ホームに戻る
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ErrorPage;