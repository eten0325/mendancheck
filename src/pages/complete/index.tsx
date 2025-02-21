import React from 'react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { supabase } from '@/supabase';

import { AiOutlineMenu } from 'react-icons/ai';
import { IoMdClose } from 'react-icons/io';

const Complete = () => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/login');
      }
    }

    checkSession();
  }, [router]);

  const handleMenuClick = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMenuNavigation = (path: string) => {
    router.push(path);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen h-full bg-gray-100">
       <button
          onClick={handleMenuClick}
          className="absolute top-4 left-4 bg-gray-200 rounded-full p-2 shadow-md z-50"
        >
          {isSidebarOpen ? <IoMdClose size={24} /> : <AiOutlineMenu size={24} />}
        </button>

        <div
          className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">メニュー</h2>
            <ul>
               <li className="mb-2">
                <button
                  onClick={() => handleMenuNavigation('/menu')}
                  className="block w-full text-left py-2 px-4 hover:bg-gray-100 rounded"
                >
                  メニュー画面
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => handleMenuNavigation('/paramSetting')}
                  className="block w-full text-left py-2 px-4 hover:bg-gray-100 rounded"
                >
                  パラメータ設定画面
                </button>
              </li>
              
            </ul>
          </div>
        </div>

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">設定変更完了画面</h1>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">完了メッセージ</h2>
              <p className="text-gray-700 mb-6">設定変更が完了しました。</p>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => router.push('/menu')}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  メニュー画面へ戻る
                </button>
                <button
                  onClick={() => router.push('/paramSetting')}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  パラメータ設定画面へ戻る
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white text-center py-4">
        <p>&copy; 2025 健康診断システム</p>
      </footer>
    </div>
  );
};

export default Complete;