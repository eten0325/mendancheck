import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Layout from './Layout';

const ScoringConfig = () => {
  const router = useRouter();

  const buttonStyle = `
    bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline
    transition duration-300 ease-in-out transform hover:scale-105
  `;

  return (
    <Layout>
      <div className="min-h-screen h-full bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800 text-center">スコアリング設定画面</h1>
              </div>
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <div className="flex justify-center">
                    <button className={buttonStyle} onClick={() => router.push('/bmi-scoring')}>BMIスコアリングルール設定</button>
                  </div>
                  <div className="flex justify-center">
                    <button className={buttonStyle} onClick={() => router.push('/blood-pressure-scoring')}>血圧スコアリングルール設定</button>
                  </div>
                  <div className="flex justify-center">
                    <button className={buttonStyle} onClick={() => router.push('/blood-sugar-scoring')}>血糖値スコアリングルール設定</button>
                  </div>
                  <div className="flex justify-center">
                    <button className={buttonStyle} onClick={() => router.push('/lipid-scoring')}>脂質スコアリングルール設定</button>
                  </div>
                  <div className="flex justify-center">
                    <button className={buttonStyle} onClick={() => router.push('/liver-function-scoring')}>肝機能スコアリングルール設定</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ScoringConfig;
