import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { FaFileUpload, FaBookOpen } from 'react-icons/fa';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Index = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // ログイン状態の確認（仮実装）
    const checkLoginStatus = () => {
      // ここにログイン状態の確認ロジックを実装
      // 例：localStorageからトークンを確認するなど
      const token = localStorage.getItem('authToken');
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
  }, []);

  const handleUploadClick = () => {
    router.push('/upload');
  };

  const handleGuideClick = () => {
    router.push('/guide');
  };

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <Header />
      <main className="container mx-auto py-6">
        <h1 className="text-2xl font-semibold mb-4">トップメニュー画面</h1>
        <p className="mb-4">健康診断データアップロード、操作ガイドへの導線を持つトップ画面</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white shadow rounded p-4 flex items-center justify-between">
            <Link href="/upload">
              <div className="flex items-center">
                <FaFileUpload className="mr-2 text-blue-500" />
                <span className="text-blue-700 hover:underline">健康診断データアップロード</span>
              </div>
            </Link>
          </div>

          <div className="bg-white shadow rounded p-4 flex items-center justify-between">
            <Link href="/guide">
              <div className="flex items-center">
                <FaBookOpen className="mr-2 text-green-500" />
                <span className="text-green-700 hover:underline">操作ガイド</span>
              </div>
            </Link>
          </div>
        </div>

        {!isLoggedIn && (
          <div className="mt-4 text-red-500">
            ログインが必要です。
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;