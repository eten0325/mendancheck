import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';
import { toast } from 'react-hot-toast';
import { FaCog, FaTimes } from 'react-icons/fa';

const Settings = () => {
  const [extractionRatio, setExtractionRatio] = useState<number | string>('');
  const [colors, setColors] = useState({
    A: '#38A169',
    B: '#4299E1',
    C: '#DD6B20',
    D: '#E53E3E',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('setting_key, setting_value')
          .in('setting_key', ['extraction_ratio', 'color_settings']);

        if (error) {
          throw error;
        }

        if (data) {
          const ratioSetting = data.find(item => item.setting_key === 'extraction_ratio');
          const colorSetting = data.find(item => item.setting_key === 'color_settings');

          if (ratioSetting && ratioSetting.setting_value) {
            setExtractionRatio(ratioSetting.setting_value as number);
          }

          if (colorSetting && colorSetting.setting_value) {
            setColors(colorSetting.setting_value as any);
          }
        }
      } catch (err: any) {
        setError(err.message || '設定の取得に失敗しました。');
        // Fallback data in case of an error
          setExtractionRatio(50);
          setColors({
            A: '#38A169',
            B: '#4299E1',
            C: '#DD6B20',
            D: '#E53E3E',
          });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [supabase]);

  const handleRatioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Validation to ensure only numbers are accepted and it's within a reasonable range
    if (/^\d+$/.test(value) || value === '') {
        const numValue = value === '' ? '' : parseInt(value, 10);
        if (numValue === '' || (typeof numValue === 'number' && numValue >= 0 && numValue <= 100)) {
            setExtractionRatio(value);
        } else {
            toast.error('抽出割合は0から100の間の整数で入力してください。');
        }
    } else {
        toast.error('数値を入力してください。');
    }
  };

  const handleColorChange = (key: string, value: string) => {
    setColors(prevColors => ({
      ...prevColors,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const updates = [
        {
          setting_key: 'extraction_ratio',
          setting_value: extractionRatio,
        },
        {
          setting_key: 'color_settings',
          setting_value: colors,
        },
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from('settings')
          .upsert({
            setting_key: update.setting_key,
            setting_value: update.setting_value,
          },
          { onConflict: 'setting_key' });

        if (error) {
          throw error;
        }
      }

      toast.success('設定が保存されました。');
    } catch (err: any) {
      setError(err.message || '設定の保存に失敗しました。');
      toast.error('設定の保存に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen h-full bg-gray-100">
       <aside className="bg-gray-200 w-64 py-8 px-4 fixed top-0 left-0 h-full">
            <div className="mb-8">
              <img src="https://placehold.co/100x50" alt="Logo" className="h-8"/>
            </div>
            <nav>
                <ul>
                    <li className="mb-2">
                        <a href="/" className="block py-2 px-4 rounded hover:bg-gray-300">ホーム</a>
                    </li>
                    <li className="mb-2">
                        <a href="/upload" className="block py-2 px-4 rounded hover:bg-gray-300">アップロード</a>
                    </li>
                    <li className="mb-2">
                        <a href="/result" className="block py-2 px-4 rounded hover:bg-gray-300">結果</a>
                    </li>
                    <li className="mb-2">
                        <a href="/settings" className="block py-2 px-4 rounded hover:bg-gray-300 bg-gray-300 font-semibold">設定</a>
                    </li>
                </ul>
            </nav>
        </aside>
      <div className="ml-64 p-8">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-800 flex items-center"><FaCog className="mr-2" /> 設定画面</h1>
        </header>

        {loading && <div className="text-center">Loading...</div>}
        {error && <div className="text-red-500 mb-4">Error: {error}</div>}

        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-4">
            <label htmlFor="extractionRatio" className="block text-gray-700 text-sm font-bold mb-2">
              上位抽出割合 (%):
            </label>
            <input
              type="number"
              id="extractionRatio"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={extractionRatio}
              onChange={handleRatioChange}
              placeholder="上位抽出割合を入力してください"
            />
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">評価結果の色設定</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(colors).map(([key, value]) => (
                <div key={key} className="flex items-center">
                  <label htmlFor={`color${key}`} className="block text-gray-700 text-sm font-bold mr-2">
                    {key}: 
                  </label>
                  <input
                    type="color"
                    id={`color${key}`}
                    className="shadow appearance-none border rounded w-24 h-10"
                    value={value}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
              onClick={handleSubmit}
              disabled={loading}
            >
              保存
            </button>
            <button
              className="bg-gray-400 hover:bg-gray-500 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleCancel}
              disabled={loading}
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
