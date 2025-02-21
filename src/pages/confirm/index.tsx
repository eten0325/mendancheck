import React from 'react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';
import { Session } from '@supabase/supabase-js';

const Confirm = () => {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const supabase = createClientComponentClient<Database>();
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };

    fetchSession();

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, [supabase]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .eq('setting_key', 'extraction_settings')
          .single();

        if (error) {
          console.error('設定の取得エラー:', error);
          // Sample data in case of error
          setSettings({
            setting_key: 'extraction_settings',
            setting_value: { extraction_ratio: 20 },
            description: '上位抽出割合の設定',
          });
        } else {
          setSettings(data);
        }
      } catch (error) {
        console.error('設定の取得中にエラーが発生しました:', error);
        // Sample data in case of error
        setSettings({
          setting_key: 'extraction_settings',
          setting_value: { extraction_ratio: 20 },
          description: '上位抽出割合の設定',
        });
      }
    };

    fetchSettings();
  }, [supabase]);

  const handleConfirm = async () => {
    // 確認処理のロジック（実際にはAPIリクエストなど）
    alert('設定変更を確定しました！');
    router.push('/complete'); // 完了画面へ遷移
  };

  const handleBack = () => {
    router.back(); // 前の画面に戻る
  };

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <Header session={session} />
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">設定変更確認画面</h1>
        <p className="mb-4">変更内容を確認してください。</p>

        {settings && (
          <div className="mb-4">
            <p>
              <strong>設定キー:</strong> {settings.setting_key}
            </p>
            <p>
              <strong>設定値:</strong> {JSON.stringify(settings.setting_value)}
            </p>
            <p>
              <strong>説明:</strong> {settings.description}
            </p>
          </div>
        )}

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={handleConfirm}
        >
          確定
        </button>
        <button
          className="bg-gray-400 hover:bg-gray-500 text-gray-700 font-bold py-2 px-4 rounded"
          onClick={handleBack}
        >
          戻る
        </button>
      </div>
      <Footer />
    </div>
  );
};

const Header = ({ session }: { session: Session | null }) => {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto py-4 px-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">ヘッダー</h2>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a href="/" className="hover:text-blue-500">ホーム</a>
            </li>
            <li>
              <a href="/paramSetting" className="hover:text-blue-500">パラメータ設定</a>
            </li>
            <li>
              <a href="/scoringResult" className="hover:text-blue-500">スコアリング結果</a>
            </li>
            <li>
              <a href="/upload" className="hover:text-blue-500">アップロード</a>
            </li>

            {
              session ?
                <li>
                  <button onClick={signOut} className="hover:text-blue-500">サインアウト</button>
                </li>
                : null
            }
          </ul>
        </nav>
      </div>
    </header>
  );
};

const Footer = () => (
  <footer className="bg-gray-200 text-center py-4">
    <p>フッター</p>
  </footer>
);

export default Confirm;
