import React from 'react';
import Image from 'next/image';
import Layout from '@/components/Layout';

const AdminDashboard = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">管理者ダッシュボード</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* システム状態 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">システム状態</h3>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">正常稼働中</span>
              </div>
            </div>

            {/* ユーザー統計 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">ユーザー統計</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">総ユーザー数</span>
                  <span className="text-sm font-medium">250</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">アクティブユーザー</span>
                  <span className="text-sm font-medium">180</span>
                </div>
              </div>
            </div>

            {/* データ処理状況 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">データ処理状況</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">処理済みファイル</span>
                  <span className="text-sm font-medium">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">処理待ちファイル</span>
                  <span className="text-sm font-medium">5</span>
                </div>
              </div>
            </div>

            {/* エラー状況 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">エラー状況</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">直近24時間</span>
                  <span className="text-sm font-medium">2件</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">未解決エラー</span>
                  <span className="text-sm font-medium">1件</span>
                </div>
              </div>
            </div>
          </div>

          {/* システムログ */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">システムログ</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Image
                      src="/icons/info.png"
                      alt="情報"
                      width={20}
                      height={20}
                      className="flex-shrink-0"
                    />
                    <div className="ml-3">
                      <p className="text-sm text-gray-600">
                        システムアップデートが正常に完了しました
                      </p>
                      <p className="mt-1 text-xs text-gray-500">2024-02-24 10:30:00</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Image
                      src="/icons/warning.png"
                      alt="警告"
                      width={20}
                      height={20}
                      className="flex-shrink-0"
                    />
                    <div className="ml-3">
                      <p className="text-sm text-gray-600">
                        バックアップ処理に遅延が発生しています
                      </p>
                      <p className="mt-1 text-xs text-gray-500">2024-02-24 09:15:00</p>
                    </div>
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

export default AdminDashboard;
