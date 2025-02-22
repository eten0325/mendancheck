import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/Layout';

const Settings = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">設定</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* システム設定 */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4">システム設定</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        言語
                      </label>
                      <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        <option>日本語</option>
                        <option>English</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        テーマ
                      </label>
                      <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        <option>ライト</option>
                        <option>ダーク</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 表示設定 */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4">表示設定</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        1ページあたりの表示件数
                      </label>
                      <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        <option>10件</option>
                        <option>20件</option>
                        <option>50件</option>
                        <option>100件</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        日付表示形式
                      </label>
                      <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        <option>YYYY/MM/DD</option>
                        <option>DD/MM/YYYY</option>
                        <option>MM/DD/YYYY</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* ナビゲーション */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">クイックナビゲーション</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href="/" className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                    <Image
                      src="/icons/home.png"
                      alt="ホーム"
                      width={32}
                      height={32}
                      className="mx-auto mb-2"
                    />
                    <span className="block text-center text-sm">ホーム</span>
                  </Link>
                  <Link href="/upload" className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                    <Image
                      src="/icons/upload.png"
                      alt="アップロード"
                      width={32}
                      height={32}
                      className="mx-auto mb-2"
                    />
                    <span className="block text-center text-sm">アップロード</span>
                  </Link>
                  <Link href="/result" className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                    <Image
                      src="/icons/result.png"
                      alt="結果"
                      width={32}
                      height={32}
                      className="mx-auto mb-2"
                    />
                    <span className="block text-center text-sm">結果</span>
                  </Link>
                  <Link href="/settings" className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                    <Image
                      src="/icons/settings.png"
                      alt="設定"
                      width={32}
                      height={32}
                      className="mx-auto mb-2"
                    />
                    <span className="block text-center text-sm">設定</span>
                  </Link>
                </div>
              </div>

              {/* 保存ボタン */}
              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  設定を保存
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
