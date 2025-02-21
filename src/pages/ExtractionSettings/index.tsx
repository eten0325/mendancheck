import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/supabase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ExtractionSettings = () => {
  const [extractionPercentage, setExtractionPercentage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('setting_value')
          .eq('setting_key', 'extraction_percentage')
          .single();

        if (error) {
          console.error('Supabase error:', error);
          setError('設定の読み込みに失敗しました。');
          setExtractionPercentage('75'); // デフォルト値を設定
        } else if (data) {
          setExtractionPercentage(data.setting_value);
        } else {
            setExtractionPercentage('75'); // デフォルト値を設定
        }
      } catch (err: any) {
        console.error('Unexpected error:', err);
        setError('設定の読み込み中に予期せぬエラーが発生しました。');
        setExtractionPercentage('75'); // デフォルト値を設定
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: updateError } = await supabase
        .from('settings')
        .update({ setting_value: extractionPercentage })
        .eq('setting_key', 'extraction_percentage');

      if (updateError) {
        console.error('Supabase update error:', updateError);
        setError('設定の保存に失敗しました');
        toast.error('設定の保存に失敗しました');
        return;
      }

      toast.success('設定が保存されました');
    } catch (err: any) {
      console.error('Unexpected error during save:', err);
      setError('設定の保存中に予期せぬエラーが発生しました');
      toast.error('設定の保存中に予期せぬエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen h-full bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">上位抽出設定画面</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="relative">
                  <label htmlFor="extractionPercentage" className="block text-gray-700 text-sm font-bold mb-2">上位抽出割合:</label>
                  <input
                    id="extractionPercentage"
                    name="extractionPercentage"
                    type="number"
                    placeholder="上位抽出割合を入力してください"
                    className="peer placeholder-gray-500 h-10 w-full border rounded-md px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={extractionPercentage}
                    onChange={(e) => setExtractionPercentage(e.target.value)}
                    min="0"
                    max="100"
                    disabled={loading}
                    aria-label="上位抽出割合:"
                  />
                </div>
                {error && <div className="text-red-500">{error}</div>}
                <div className="relative">
                  <button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline active:bg-blue-800"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    保存
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ExtractionSettings;

import { ToastContainer } from 'react-toastify';
