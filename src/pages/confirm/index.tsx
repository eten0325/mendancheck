import React from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';

const Confirm = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">確認</h2>

              <div className="space-y-6">
                {/* アップロード情報 */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">アップロード情報</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">ファイル名</dt>
                        <dd className="mt-1 text-sm text-gray-900">health_data.csv</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">ファイルサイズ</dt>
                        <dd className="mt-1 text-sm text-gray-900">2.5 MB</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">データ件数</dt>
                        <dd className="mt-1 text-sm text-gray-900">100件</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* バリデーション結果 */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">バリデーション結果</h3>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">
                          すべての項目が正常に検証されました
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* データプレビュー */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">データプレビュー</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BMI</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">血圧</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">血糖値</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1001</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">22.5</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">120/80</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">95</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1002</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">24.8</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">130/85</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">102</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* ナビゲーションボタン */}
              <div className="mt-8 flex justify-between">
                <div className="flex space-x-4">
                  <Link
                    href="/"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    ホームに戻る
                  </Link>
                  <Link
                    href="/paramSetting"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    パラメータ設定に戻る
                  </Link>
                </div>
                <Link
                  href="/upload"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  アップロードを開始
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Confirm;
