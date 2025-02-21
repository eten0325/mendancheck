import React from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Header from '@/components/Header';

const Validation = () => {
  const router = useRouter();

  const handleRetry = () => {
    router.push('/upload');
  };

  const handleMain = () => {
    router.push('/main');
  };

  // サンプルエラーメッセージと成功メッセージ
  const errors = [
    '1行目のデータにエラーがあります: BMIの値が無効です。',
    '5行目のデータにエラーがあります: 血圧の値が無効です。',
  ];
  const successes = [
    '2行目のデータは正常に検証されました。',
    '3行目のデータは正常に検証されました。',
    '4行目のデータは正常に検証されました。',
  ];

  return (
    <Layout>
      <Header />
      <div className="min-h-screen h-full bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <div>
                <h1 className="text-2xl font-semibold">検証結果画面</h1>
              </div>
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <h2 className="text-lg font-semibold">エラーメッセージ</h2>
                  {errors.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {errors.map((error, index) => (
                        <li key={index} className="text-red-500">{error}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-green-500">エラーはありません。</p>
                  )}

                  <h2 className="text-lg font-semibold">成功メッセージ</h2>
                  {successes.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {successes.map((success, index) => (
                        <li key={index} className="text-green-500">{success}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">成功したデータはありません。</p>
                  )}
                </div>
                <div className="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
                  <button
                    onClick={handleRetry}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4"
                  >
                    再アップロード
                  </button>
                  <button
                    onClick={handleMain}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    メイン画面へ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Validation;
