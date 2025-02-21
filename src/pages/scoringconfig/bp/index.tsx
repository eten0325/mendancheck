import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Layout } from '@/components/Layout';

const ScoringConfigBP = () => {
  const [systolicRange1, setSystolicRange1] = useState('');
  const [diastolicRange1, setDiastolicRange1] = useState('');
  const [score1, setScore1] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/api/settings?setting_key=systolic_range_1&setting_key=diastolic_range_1&setting_key=score_1');
      const settings = response.data;

      const systolicSetting = settings.find((setting: any) => setting.setting_key === 'systolic_range_1');
      const diastolicSetting = settings.find((setting: any) => setting.setting_key === 'diastolic_range_1');
      const scoreSetting = settings.find((setting: any) => setting.setting_key === 'score_1');

      setSystolicRange1(systolicSetting ? systolicSetting.setting_value : '');
      setDiastolicRange1(diastolicSetting ? diastolicSetting.setting_value : '');
      setScore1(scoreSetting ? scoreSetting.setting_value : '');
      setLoading(false);

    } catch (error: any) {
      console.error('設定の取得に失敗しました:', error);
      setErrorMessage('データ取得エラー');
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setErrorMessage('');
      const data = [
        { setting_key: 'systolic_range_1', setting_value: systolicRange1 },
        { setting_key: 'diastolic_range_1', setting_value: diastolicRange1 },
        { setting_key: 'score_1', setting_value: score1 },
      ];
      await axios.post('/api/settings', data);
      alert('保存成功');
    } catch (error: any) {
      console.error('設定の保存に失敗しました:', error);
      setErrorMessage('APIエラー');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen h-full flex justify-center items-center">
          <p>ロード中...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen h-full">
        <div className="container mx-auto py-8">
          <h1 className="text-2xl font-bold mb-4">血圧スコアリングルール設定</h1>

          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">エラー!</strong>
              <span className="block sm:inline">{errorMessage}</span>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="systolicRange1">
              収縮期血圧範囲
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="systolicRange1"
              type="text"
              placeholder="例: 120-130"
              value={systolicRange1}
              onChange={(e) => setSystolicRange1(e.target.value)}
              data-testid="systolic-input"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="diastolicRange1">
              拡張期血圧範囲
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="diastolicRange1"
              type="text"
              placeholder="例: 80-90"
              value={diastolicRange1}
              onChange={(e) => setDiastolicRange1(e.target.value)}
              data-testid="diastolic-input"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="score1">
              スコア
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="score1"
              type="number"
              placeholder="例: 1"
              value={score1}
              onChange={(e) => setScore1(e.target.value)}
              data-testid="score-input"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleSave}
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ScoringConfigBP;