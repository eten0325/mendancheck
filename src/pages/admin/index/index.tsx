import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Session } from '@supabase/supabase-js';
import { FaCog, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

const AdminPage = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <div className="flex flex-col h-full">
        {/* ヘッダー */}
        <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={toggleSidebar} className="mr-4 lg:hidden">
              {sidebarOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
            <h1 className="text-2xl font-semibold text-gray-800">管理者画面</h1>
          </div>
          <button
            onClick={handleSignOut}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            サインアウト
          </button>
        </header>

        {/* メインコンテンツ */}
        <div className="flex flex-1">
          {/* サイドバー (PC) */}
          <aside
            className={`bg-gray-200 w-64 p-6 hidden lg:block ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
transition-transform duration-300 ease-in-out`}
            data-testid="sidebar"
          >
            <nav>
              <h2 className="text-lg font-semibold mb-4">メニュー</h2>
              <ul>
                <li className="mb-2">
                  <a href="/admin/log" className="hover:bg-gray-300 py-2 px-4 block rounded">
                    ログ管理メニュー
                  </a>
                </li>
                <li className="mb-2">
                  <a href="/admin/settings" className="hover:bg-gray-300 py-2 px-4 block rounded">
                    設定管理メニュー
                  </a>
                </li>
              </ul>
            </nav>
          </aside>

          {/* サイドバー (モバイル) */}
          <aside
            className={`fixed top-0 left-0 h-full w-64 bg-gray-200 p-6 shadow-md z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:hidden`}
            data-testid="sidebar"
          >
            <div className="flex justify-end mb-4">
              <button onClick={toggleSidebar} className="p-2 bg-gray-300 rounded-full">
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            <nav>
              <h2 className="text-lg font-semibold mb-4">メニュー</h2>
              <ul>
                <li className="mb-2">
                  <a href="/admin/log" className="hover:bg-gray-300 py-2 px-4 block rounded">
                    ログ管理メニュー
                  </a>
                </li>
                <li className="mb-2">
                  <a href="/admin/settings" className="hover:bg-gray-300 py-2 px-4 block rounded">
                    設定管理メニュー
                  </a>
                </li>
              </ul>
            </nav>
          </aside>

          {/* コンテンツ */}
          <main className="flex-1 p-6">
            <h2 className="text-xl font-semibold mb-4">ダッシュボード</h2>
            <div className="bg-white shadow rounded p-4">
              <p>システム管理者が利用する画面です。</p>
              <img
                src="https://placehold.co/600x400?text=Dashboard"
                alt="Dashboard Placeholder"
                className="mt-4 rounded"
              />
            </div>
          </main>
        </div>

        {/* フッター */}
        <footer className="bg-gray-300 py-2 px-6 text-center">
          <p>&copy; 2025 Health Check System</p>
        </footer>
      </div>
    </div>
  );
};

export default AdminPage;
