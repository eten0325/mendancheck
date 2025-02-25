import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

const ParamSetting = () => {
  const [extractionRatio, setExtractionRatio] = useState<number | null>(null);
  const [tempRatio, setTempRatio] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Replace with actual Supabase fetch logic if needed
        // const { data, error } = await supabase
        //   .from('settings')
        //   .select('setting_value')
        //   .eq('setting_key', 'extraction_ratio')
        //   .single();

        // if (error) {
        //   console.error('Error fetching data:', error);
        //   setErrorMessage('データの取得に失敗しました。');
        // } else {
        //   setExtractionRatio(data.setting_value.ratio);
        // }
        setExtractionRatio(50);
      } catch (error) {
        console.error('Unexpected error:', error);
        setErrorMessage('予期せぬエラーが発生しました。');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTempRatio(event.target.value);
  };

  const handleSubmit = async () => {
    const ratio = Number(tempRatio);
    if (isNaN(ratio) || ratio < 0 || ratio > 100) {
      setErrorMessage('上位抽出割合は0から100の範囲で入力してください。');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // Replace with actual Supabase update logic
      // const { error } = await supabase
      //   .from('settings')
      //   .update({ setting_value: { ratio: ratio } })
      //   .eq('setting_key', 'extraction_ratio');

      // if (error) {
      //   console.error('Error updating data:', error);
      //   setErrorMessage('設定の更新に失敗しました。');
      // } else {
      //   setExtractionRatio(ratio);
      //   router.push('/confirm');
      // }

      setExtractionRatio(ratio);
      router.push('/confirm');

    } catch (error) {
      console.error('Unexpected error:', error);
      setErrorMessage('予期せぬエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen h-full bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <Header />
        <main className="container mx-auto mt-8 p-4 bg-white shadow-md rounded-md">
          <h1 className="text-2xl font-semibold mb-4">パラメータ設定画面</h1>
          {isLoading && <div className="text-yellow-500">Loading...</div>}
          {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

          <div className="mb-4">
            <label htmlFor="extractionRatio" className="block text-gray-700 text-sm font-bold mb-2">
              上位抽出割合:
            </label>
            <input
              type="number"
              id="extractionRatio"
              value={tempRatio}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={isLoading}
          >
            設定変更確認
          </button>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default ParamSetting;


const Header = () => {
  return (
    <header className="bg-white shadow-md p-4">
      <h1 className="text-lg font-semibold">Header</h1>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="bg-white shadow-md p-4 mt-8 text-center">
      <p>Footer</p>
    </footer>
  );
};

const Sidebar = () => {
  const router = useRouter();

  const menuItems = [
    { label: 'ファイルアップロード画面', path: '/fileUpload' },
    { label: 'スコアリング設定画面', path: '/scoringConfig' },
    { label: 'メインメニュー画面', path: '/mainMenu' },
    { label: '設定画面', path: '/settings' },
    { label: 'パラメータ設定画面', path: '/paramSetting' },
    { label: '上位抽出割合編集画面', path: '/editParam' },
    { label: '設定変更確認画面', path: '/confirm' },
    { label: '設定変更完了画面', path: '/complete' },
  ];

  return (
    <div className="w-64 bg-gray-200 p-4">
      <h2 className="text-xl font-semibold mb-4">メニュー</h2>
      <ul>
        {menuItems.map((item) => (
          <li key={item.label} className="mb-2">
            <button
              onClick={() => router.push(item.path)}
              className="block w-full text-left p-2 hover:bg-gray-300 rounded"
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};