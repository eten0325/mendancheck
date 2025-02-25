import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const UploadResult = () => {
  const router = useRouter();
  const [resultMessage, setResultMessage] = useState<string>('');

  const handleSuccess = () => {
    setResultMessage('アップロード成功！');
  };

  const handleFailure = () => {
    setResultMessage('アップロード失敗...');
  };

  const handleProcessing = () => {
    router.push('/processingStatus'); // 処理状況画面への遷移
  };

  const handleReupload = () => {
    router.push('/fileUpload'); // ファイルアップロード画面への遷移
  };

  return (
    <Layout>
      <div className="min-h-screen h-full flex flex-col items-center justify-center bg-gray-100">
        <Header />
        <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
          <h1 className="text-4xl font-bold">
            アップロード結果画面
          </h1>

          <div className="mt-6">
            <p data-testid="result-message" className="text-lg">
              {resultMessage}
            </p>
          </div>

          <div className="mt-8 space-x-4">
            <button
              onClick={handleSuccess}
              data-testid="success-button"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              成功
            </button>
            <button
              onClick={handleFailure}
              data-testid="failure-button"
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              失敗
            </button>
          </div>

          <div className="mt-8 space-x-4">
            <button
              onClick={handleProcessing}
              data-testid="processing-button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              処理状況画面へ
            </button>
            <button
              onClick={handleReupload}
              data-testid="reupload-button"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              再アップロード
            </button>
          </div>
        </main>
        <Footer />
      </div>
    </Layout>
  );
};

export default UploadResult;