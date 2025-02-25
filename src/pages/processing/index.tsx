import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Processing = () => {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('処理状況：初期化中...');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let timer1: NodeJS.Timeout;
    let timer2: NodeJS.Timeout;
    let timer3: NodeJS.Timeout;

    // 処理状況を更新する関数
    const updateProgress = () => {
      timer1 = setTimeout(() => {
        setProgress(25);
        setMessage('処理状況：データ読み込み中...');

        timer2 = setTimeout(() => {
          setProgress(50);
          setMessage('処理状況：データ分析中...');

          timer3 = setTimeout(() => {
            setProgress(75);
            setMessage('処理状況：結果生成中...');

            setTimeout(() => {
              setProgress(100);
              setMessage('処理状況：完了！');

              // 完了後、結果画面に遷移するなどの処理を追加できます
              // router.push('/result');

            }, 5000);
          }, 10000);
        }, 10000);
      }, 5000);
    };

    // 30秒後にエラーを発生させる (テスト用)
    const errorTimer = setTimeout(() => {
      setError('処理中にエラーが発生しました。');
    }, 30000);

    updateProgress();

    // コンポーネントがアンマウントされた際にタイマーをクリアする
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(errorTimer);
    };
  }, [router]);

  const handleRetry = () => {
    // リトライ処理を実装する (例: 画面をリロード)
    window.location.reload();
  };

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">処理状況画面</h1>

        <div className="mb-4">
          <div className="text-lg font-semibold">{message}</div>
          <progress role="progressbar" className="w-full h-4" value={progress} max="100"></progress>
        </div>

        {error && (
          <div className="text-red-500 mb-4">
            {error}
            <button
              onClick={handleRetry}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4"
              role="button"
            >
              リトライ
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Processing;
