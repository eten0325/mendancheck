import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { FaFileUpload, FaChartBar, FaCog } from 'react-icons/fa';
import { supabase } from '@/supabase';

const Menu = () => {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  useEffect(() => {
    if (session) {
      fetchUser();
    }
  }, [session]);

  const fetchUser = async () => {
    if (session?.user?.id) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('ユーザー情報の取得エラー:', error);
      }

      if (data) {
        setUser(data);
      }
    }
  };

  const handleFileUpload = () => {
    router.push('/fileUpload');
  };

  const handleDataAnalysis = () => {
    router.push('/dataAnalysis');
  };

  const handleParameterSetting = () => {
    router.push('/settings');
  };

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <Header session={session} user={user} />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">メニュー画面</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={handleFileUpload}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded shadow flex items-center justify-center transition duration-300"
          >
            <FaFileUpload className="mr-2" />
            ファイルアップロード
          </button>

          <button
            onClick={handleDataAnalysis}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-4 px-6 rounded shadow flex items-center justify-center transition duration-300"
          >
            <FaChartBar className="mr-2" />
            データ分析
          </button>

          <button
            onClick={handleParameterSetting}
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-4 px-6 rounded shadow flex items-center justify-center transition duration-300"
          >
            <FaCog className="mr-2" />
            パラメータ設定
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const Header = ({ session, user }) => {
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('サインアウトエラー:', error);
    }
    router.push('/login');
  };
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto py-4 px-5 flex items-center justify-between">
        <Link href="/" className="text-2xl font-semibold text-gray-800">
          健康診断システム
        </Link>
        {session ? (
          <div className="flex items-center">
            <span className="mr-4">こんにちは、{user?.name || 'ユーザー'}さん！</span>
            <button
              onClick={handleSignOut}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              サインアウト
            </button>
          </div>
        ) : (
          <div>
            <Link href="/login" className="mr-4 hover:text-blue-500">
              ログイン
            </Link>
            <Link href="/register" className="hover:text-blue-500">
              登録
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-200 text-center py-4">
      <p className="text-gray-600">© 2025 健康診断システム</p>
    </footer>
  );
};

export default Menu;
