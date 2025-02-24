import React from 'react';
import Image from 'next/image';
import Layout from '@/components/Layout';

const AnalysisView = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">分析ビュー</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* BMI分布 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">BMI分布</h3>
                <Image
                  src="/icons/bmi.png"
                  alt="BMI"
                  width={24}
                  height={24}
                  className="text-gray-400"
                />
              </div>
              <div className="h-64 bg-gray-50 rounded-lg"></div>
            </div>

            {/* 血圧分布 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">血圧分布</h3>
                <Image
                  src="/icons/blood-pressure.png"
                  alt="血圧"
                  width={24}
                  height={24}
                  className="text-gray-400"
                />
              </div>
              <div className="h-64 bg-gray-50 rounded-lg"></div>
            </div>

            {/* 血糖値分布 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">血糖値分布</h3>
                <Image
                  src="/icons/blood-sugar.png"
                  alt="血糖値"
                  width={24}
                  height={24}
                  className="text-gray-400"
                />
              </div>
              <div className="h-64 bg-gray-50 rounded-lg"></div>
            </div>

            {/* 肝機能分布 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">肝機能分布</h3>
                <Image
                  src="/icons/liver.png"
                  alt="肝機能"
                  width={24}
                  height={24}
                  className="text-gray-400"
                />
              </div>
              <div className="h-64 bg-gray-50 rounded-lg"></div>
            </div>
          </div>

          {/* 分析サマリー */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">分析サマリー</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700">全体的な傾向</h4>
                <p className="mt-1 text-sm text-gray-600">
                  データセット全体として、健康状態は良好な範囲内にあります。
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">注目ポイント</h4>
                <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                  <li>BMIは正常範囲内に分布が集中</li>
                  <li>血圧値は軽度高血圧の傾向</li>
                  <li>血糖値は基準値内に収まっている</li>
                  <li>肝機能値は要観察者が若干存在</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AnalysisView;