import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaSlidersH, FaSave, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../Layout';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const ScoringConfigGlucose = () => {
  const router = useRouter();
  const [glucoseRange1, setGlucoseRange1] = useState('');
  const [glucoseRange2, setGlucoseRange2] = useState('');
  const [hba1cRange1, setHba1cRange1] = useState('');
  const [hba1cRange2, setHba1cRange2] = useState('');
  const [score1, setScore1] = useState('');
  const [score2, setScore2] = useState('');
  const [score3, setScore3] = useState('');
  const [score4, setScore4] = useState('');

  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .in('setting_key', [
            'glucose_range_1',
            'glucose_range_2',
            'hba1c_range_1',
            'hba1c_range_2',
            'glucose_score_1',
            'glucose_score_2',
            'glucose_score_3',
            'glucose_score_4',
          ]);

        if (error) {
          console.error('Supabaseからの設定読み込みエラー:', error);
          toast.error('設定の読み込みに失敗しました。');
          // Provide sample data as fallback
          setGlucoseRange1('70-99');
          setGlucoseRange2('100-125');
          setHba1cRange1('4.8-5.6');
          setHba1cRange2('5.7-6.4');
          setScore1('1');
          setScore2('2');
          setScore3('3');
          setScore4('4');
          return;
        }

        if (data) {
          const settingsMap = data.reduce((acc, item) => {
            acc[item.setting_key] = item.setting_value;
            return acc;
          }, {});

          setGlucoseRange1(settingsMap['glucose_range_1'] || '');
          setGlucoseRange2(settingsMap['glucose_range_2'] || '');
          setHba1cRange1(settingsMap['hba1c_range_1'] || '');
          setHba1cRange2(settingsMap['hba1c_range_2'] || '');
          setScore1(settingsMap['glucose_score_1'] || '');
          setScore2(settingsMap['glucose_score_2'] || '');
          setScore3(settingsMap['glucose_score_3'] || '');
          setScore4(settingsMap['glucose_score_4'] || '');
        }
      } catch (err) {
        console.error('API エラー:', err);
        toast.error('設定の読み込み中にエラーが発生しました。');
         // Provide sample data as fallback
          setGlucoseRange1('70-99');
          setGlucoseRange2('100-125');
          setHba1cRange1('4.8-5.6');
          setHba1cRange2('5.7-6.4');
          setScore1('1');
          setScore2('2');
          setScore3('3');
          setScore4('4');
      }
    };

    fetchSettings();
  }, [supabase]);

  const handleSave = async () => {
    try {
      const updates = [
        { setting_key: 'glucose_range_1', setting_value: glucoseRange1 },
        { setting_key: 'glucose_range_2', setting_value: glucoseRange2 },
        { setting_key: 'hba1c_range_1', setting_value: hba1cRange1 },
        { setting_key: 'hba1c_range_2', setting_value: hba1cRange2 },
        { setting_key: 'glucose_score_1', setting_value: score1 },
        { setting_key: 'glucose_score_2', setting_value: score2 },
        { setting_key: 'glucose_score_3', setting_value: score3 },
        { setting_key: 'glucose_score_4', setting_value: score4 },
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from('settings')
          .upsert(update, { onConflict: 'setting_key' });

        if (error) {
          console.error('Supabaseへの保存エラー:', error);
          toast.error(`${update.setting_key}の保存に失敗しました。`);
          return;
        }
      }

      toast.success('設定が正常に保存されました！');
    } catch (err) {
      console.error('保存エラー:', err);
      toast.error('設定の保存中にエラーが発生しました。');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen h-full bg-gray-100 py-6 flex flex-col justify-start sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="flex items-center space-x-3">
              <button onClick={() => router.back()} className="absolute top-4 left-4 text-gray-600 hover:text-gray-800">
                  <FaArrowLeft size={24} />
              </button>
              <div className="flex-grow text-center">
                <h1 className="text-2xl font-bold text-gray-900">血糖値スコアリングルール設定</h1>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">

                <div className="flex flex-col space-y-2">
                  <label className="text-gray-700">血糖値範囲1:</label>
                  <input
                    type="text"
                    className="px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                    placeholder="例: 70-99"
                    value={glucoseRange1}
                    onChange={(e) => setGlucoseRange1(e.target.value)}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-gray-700">血糖値範囲2:</label>
                  <input
                    type="text"
                    className="px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                    placeholder="例: 100-125"
                    value={glucoseRange2}
                    onChange={(e) => setGlucoseRange2(e.target.value)}
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-gray-700">HbA1c範囲1:</label>
                  <input
                    type="text"
                    className="px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                    placeholder="例: 4.8-5.6"
                    value={hba1cRange1}
                    onChange={(e) => setHba1cRange1(e.target.value)}
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-gray-700">HbA1c範囲2:</label>
                  <input
                    type="text"
                    className="px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                    placeholder="例: 5.7-6.4"
                    value={hba1cRange2}
                    onChange={(e) => setHba1cRange2(e.target.value)}
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-gray-700">スコア1:</label>
                  <input
                    type="number"
                    className="px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                    value={score1}
                    onChange={(e) => setScore1(e.target.value)}
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-gray-700">スコア2:</label>
                  <input
                    type="number"
                    className="px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                    value={score2}
                    onChange={(e) => setScore2(e.target.value)}
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-gray-700">スコア3:</label>
                  <input
                    type="number"
                    className="px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                    value={score3}
                    onChange={(e) => setScore3(e.target.value)}
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-gray-700">スコア4:</label>
                  <input
                    type="number"
                    className="px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                    value={score4}
                    onChange={(e) => setScore4(e.target.value)}
                  />
                </div>
              </div>


              <div className="pt-4 flex items-center space-x-2">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={handleSave}
                >
                  <FaSave className="inline-block mr-2" />
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ScoringConfigGlucose;
