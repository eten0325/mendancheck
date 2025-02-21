import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from './Layout';
import axios from 'axios';

const Config = () => {
  const [extractionRate, setExtractionRate] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/api/settings?setting_key=extraction_rate');
        if (response.status === 200 && response.data.length > 0) {
          setExtractionRate(response.data[0].setting_value || '');
        } else {
          console.warn('抽出割合設定が見つかりませんでした。');
        }
      } catch (error) {
        console.error('設定取得エラー:', error);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/settings', {
        setting_key: 'extraction_rate',
        setting_value: extractionRate,
      });

      if (response.status === 200) {
        router.push('/main');
      } else {
        console.error('設定保存に失敗しました。');
      }
    } catch (error) {
      console.error('設定保存エラー:', error);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen h-full bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800 text-center">上位抽出割合設定</h1>
              </div>
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="extractionRate" className="block text-sm font-medium text-gray-700">割合 (%):</label>
                      <div className="mt-1">
                        <input
                          type="number"
                          id="extractionRate"
                          value={extractionRate}
                          onChange={(e) => setExtractionRate(e.target.value)}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        保存
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Config;