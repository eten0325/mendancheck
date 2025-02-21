import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/Layout';
import axios from 'axios';

const LipidScoringRuleSetting = () => {
  const router = useRouter();
  const [ldlRange, setLdlRange] = useState({
    min: '',
    max: '',
  });
  const [tgRange, setTgRange] = useState({
    min: '',
    max: '',
  });
  const [score, setScore] = useState('');
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    // Fetch initial settings data
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/api/settings');
        setSettings(response.data);
      } catch (error) {
        console.error('設定データの取得エラー:', error);
        // Fallback data for demonstration purposes
        setSettings({
          ldl: { min: 80, max: 140, score: 2 },
          tg: { min: 30, max: 150, score: 3 },
        });
      }
    };

    fetchSettings();
  }, []);

  const handleLdlChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    setLdlRange({ ...ldlRange, [type]: e.target.value });
  };

  const handleTgChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    setTgRange({ ...tgRange, [type]: e.target.value });
  };

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScore(e.target.value);
  };

  const handleSave = async () => {
    try {
      const response = await axios.post('/api/settings', {
        ldlRange,
        tgRange,
        score,
      });

      if (response.data.success) {
        alert('保存に成功しました。');
      } else {
        alert('保存に失敗しました。');
      }
    } catch (error) {
      console.error('保存エラー:', error);
      alert('保存エラー');
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
                <h1 className="text-2xl font-semibold">脂質スコアリングルール設定</h1>
              </div>
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="ldl-min">LDLコレステロール 最小値:</label>
                    <input
                      type="number"
                      id="ldl-min"
                      value={ldlRange.min}
                      onChange={(e) => handleLdlChange(e, 'min')}
                      className="px-4 py-2 border rounded-md focus:ring focus:ring-blue-200 outline-none"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="ldl-max">LDLコレステロール 最大値:</label>
                    <input
                      type="number"
                      id="ldl-max"
                      value={ldlRange.max}
                      onChange={(e) => handleLdlChange(e, 'max')}
                      className="px-4 py-2 border rounded-md focus:ring focus:ring-blue-200 outline-none"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="tg-min">TG 最小値:</label>
                    <input
                      type="number"
                      id="tg-min"
                      value={tgRange.min}
                      onChange={(e) => handleTgChange(e, 'min')}
                      className="px-4 py-2 border rounded-md focus:ring focus:ring-blue-200 outline-none"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="tg-max">TG 最大値:</label>
                    <input
                      type="number"
                      id="tg-max"
                      value={tgRange.max}
                      onChange={(e) => handleTgChange(e, 'max')}
                      className="px-4 py-2 border rounded-md focus:ring focus:ring-blue-200 outline-none"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="score">スコア:</label>
                    <input
                      type="number"
                      id="score"
                      value={score}
                      onChange={handleScoreChange}
                      className="px-4 py-2 border rounded-md focus:ring focus:ring-blue-200 outline-none"
                    />
                  </div>
                </div>
                <div className="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
                  <button
                    onClick={handleSave}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    保存
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

export default LipidScoringRuleSetting;