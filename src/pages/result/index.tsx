import React from 'react';
import Image from 'next/image';
import Layout from '@/components/Layout';

const Result = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">評価結果</h2>

          {/* 総合評価 */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">総合評価</h3>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-indigo-600 mr-2">85</span>
                  <span className="text-sm text-gray-500">/ 100点</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>

          {/* 項目別評価 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* BMI */}
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Image
                      src="/icons/bmi.png"
                      alt="BMI"
                      width={24}
                      height={24}
                      className="mr-2"
                    />
                    <h3 className="text-lg font-medium text-gray-900">BMI</h3>
                  </div>
                  <span className="px-2 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                    A
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">22.5</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
            </div>

            {/* 血圧 */}
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Image
                      src="/icons/blood-pressure.png"
                      alt="血圧"
                      width={24}
                      height={24}
                      className="mr-2"
                    />
                    <h3 className="text-lg font-medium text-gray-900">血圧</h3>
                  </div>
                  <span className="px-2 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    B
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">130/85</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>

            {/* 血糖値 */}
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Image
                      src="/icons/blood-sugar.png"
                      alt="血糖値"
                      width={24}
                      height={24}
                      className="mr-2"
                    />
                    <h3 className="text-lg font-medium text-gray-900">血糖値</h3>
                  </div>
                  <span className="px-2 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                    A
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">95 mg/dL</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
            </div>

            {/* 肝機能 */}
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Image
                      src="/icons/liver.png"
                      alt="肝機能"
                      width={24}
                      height={24}
                      className="mr-2"
                    />
                    <h3 className="text-lg font-medium text-gray-900">肝機能</h3>
                  </div>
                  <span className="px-2 py-1 text-sm font-semibold rounded-full bg-orange-100 text-orange-800">
                    C
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">AST: 35, ALT: 40, γ-GTP: 45</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Result;
