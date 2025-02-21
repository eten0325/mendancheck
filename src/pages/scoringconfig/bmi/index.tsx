import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from './Layout';
import { supabase } from '../utils/supabaseClient';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BMIScoringRuleSetting = () => {
  const [bmiRange1, setBmiRange1] = useState('');
  const [score1, setScore1] = useState('');
  const [bmiRange2, setBmiRange2] = useState('');
  const [score2, setScore2] = useState('');
  const [settings, setSettings] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .in('setting_key', ['bmi_range_1', 'score_1', 'bmi_range_2', 'score_2']);

      if (error) {
        console.error('Error fetching settings:', error);
        toast.error('設定の取得に失敗しました。');
        return;
      }

      if (data) {
        const bmiRange1Setting = data.find((item) => item.setting_key === 'bmi_range_1');
        const score1Setting = data.find((item) => item.setting_key === 'score_1');
        const bmiRange2Setting = data.find((item) => item.setting_key === 'bmi_range_2');
        const score2Setting = data.find((item) => item.setting_key === 'score_2');

        setBmiRange1(bmiRange1Setting ? bmiRange1Setting.setting_value : '');
        setScore1(score1Setting ? score1Setting.setting_value : '');
        setBmiRange2(bmiRange2Setting ? bmiRange2Setting.setting_value : '');
        setScore2(score2Setting ? score2Setting.setting_value : '');

        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('設定の取得中にエラーが発生しました。');
    }
  };

  const handleSave = async () => {
    try {
      // Update or Insert settings
      await updateOrInsertSetting('bmi_range_1', bmiRange1);
      await updateOrInsertSetting('score_1', score1);
      await updateOrInsertSetting('bmi_range_2', bmiRange2);
      await updateOrInsertSetting('score_2', score2);

      toast.success('設定が保存されました。');
      fetchSettings(); // Refresh settings after saving
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('設定の保存中にエラーが発生しました。');
    }
  };

  const updateOrInsertSetting = async (key, value) => {
    const { data: existingSetting, error: selectError } = await supabase
      .from('settings')
      .select('*')
      .eq('setting_key', key)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      throw selectError;
    }

    if (existingSetting) {
      // Update existing setting
      const { error: updateError } = await supabase
        .from('settings')
        .update({ setting_value: value, updated_at: new Date() })
        .eq('setting_key', key);

      if (updateError) {
        throw updateError;
      }
    } else {
      // Insert new setting
      const { error: insertError } = await supabase
        .from('settings')
        .insert([{ setting_key: key, setting_value: value, description: `${key}の設定`, created_at: new Date(), updated_at: new Date() }]);

      if (insertError) {
        throw insertError;
      }
    }
  };

  return (
    <div className="min-h-screen h-full bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">BMIスコアリングルール設定</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex flex-col">
                  <label className="leading-loose">BMI値範囲1:</label>
                  <input
                    type="text"
                    className="px-4 py-2 border focus:ring-blue-500 focus:border-blue-500 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    value={bmiRange1}
                    onChange={(e) => setBmiRange1(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="leading-loose">スコア1:</label>
                  <input
                    type="text"
                    className="px-4 py-2 border focus:ring-blue-500 focus:border-blue-500 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    value={score1}
                    onChange={(e) => setScore1(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="leading-loose">BMI値範囲2:</label>
                  <input
                    type="text"
                    className="px-4 py-2 border focus:ring-blue-500 focus:border-blue-500 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    value={bmiRange2}
                    onChange={(e) => setBmiRange2(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="leading-loose">スコア2:</label>
                  <input
                    type="text"
                    className="px-4 py-2 border focus:ring-blue-500 focus:border-blue-500 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    value={score2}
                    onChange={(e) => setScore2(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="pt-4 flex items-center space-x-4">
              <button
                className="bg-blue-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
                onClick={handleSave}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

BMIScoringRuleSetting.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  );
}

export default BMIScoringRuleSetting;
