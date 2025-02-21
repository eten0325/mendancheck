import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/supabase';
import { AiOutlineSave } from 'react-icons/ai';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Setting = () => {
  const [extractRatio, setExtractRatio] = useState<number | string>('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('setting_value')
          .eq('setting_key', 'extract_ratio')
          .single();

        if (error) {
          console.error('設定の取得エラー:', error);
          toast.error('設定の取得に失敗しました。', { position: toast.POSITION.TOP_CENTER });
          setExtractRatio(''); // デフォルト値
        } else if (data && data.setting_value) {
          setExtractRatio(data.setting_value.value);
        } else {
            setExtractRatio('');
        }
      } catch (error) {
        console.error('設定の取得エラー:', error);
        toast.error('設定の取得中にエラーが発生しました。', { position: toast.POSITION.TOP_CENTER });
        setExtractRatio(''); // デフォルト値
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setExtractRatio(value);
    } else {
        toast.warn('数値を入力してください。', { position: toast.POSITION.TOP_CENTER });
    }

  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('settings')
        .upsert([
          {
            setting_key: 'extract_ratio',
            setting_value: { value: extractRatio },
            description: '上位抽出割合の設定',
          },
        ],
        { onConflict: 'setting_key' });

      if (error) {
        console.error('設定の保存エラー:', error);
        toast.error('設定の保存に失敗しました。', { position: toast.POSITION.TOP_CENTER });
      } else {
        toast.success('設定が保存されました。', { position: toast.POSITION.TOP_CENTER });
      }
    } catch (error) {
      console.error('設定の保存エラー:', error);
      toast.error('設定の保存中にエラーが発生しました。', { position: toast.POSITION.TOP_CENTER });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">抽出設定画面</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-4 sm:px-0">
            <div className="rounded-lg shadow-md overflow-hidden">
              <div className="bg-white p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="extractRatio" className="block text-sm font-medium text-gray-700">上位抽出割合 (%):</label>
                    <div className="mt-1">
                      <input
                        type="number"
                        id="extractRatio"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={extractRatio}
                        onChange={handleChange}
                        placeholder="例: 50"
                      />
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    >
                      {isLoading ? (
                        <>保存中... <AiOutlineSave className="ml-2 animate-spin" /></>
                      ) : (
                        <>保存 <AiOutlineSave className="ml-2" /></>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-white shadow mt-8">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          <p>&copy; 2025 健康診断結果分析システム</p>
        </div>
      </footer>
    </div>
  );
};

export default Setting;
