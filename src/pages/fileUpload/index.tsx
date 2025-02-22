import React, { useState } from 'react';
import Router from 'next/router';
import Layout from '@/components/Layout';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type !== 'text/csv') {
      setErrorMessage('CSVファイルのみアップロード可能です。');
      return;
    }
    setSelectedFile(file || null);
    setErrorMessage('');
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type !== 'text/csv') {
      setErrorMessage('CSVファイルのみアップロード可能です。');
      return;
    }
    setSelectedFile(file || null);
    setErrorMessage('');
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage('ファイルを選択してください。');
      return;
    }

    setIsLoading(true);
    try {
      // ファイルを読み込んでテキストとして取得
      const fileContent = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = (e) => reject(e);
        reader.readAsText(selectedFile);
      });

      // APIエンドポイントにデータを送信
      const response = await fetch('/api/scoring-rule/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileContent }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'アップロードに失敗しました。');
      }

      const result = await response.json();
      console.log('スコアリング結果:', result);

      // 結果表示画面に遷移
      Router.push('/scoringresult');
    } catch (err: any) {
      console.error('エラー:', err);
      setErrorMessage(err.message || '予期せぬエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen h-full flex flex-col items-center justify-center bg-gray-100">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">健康診断データアップロード</h1>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file-select">
              CSVファイルを選択：
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="file-select"
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              disabled={isLoading}
            />
          </div>

          <div
            id="drop-area"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={`border-2 border-dashed rounded p-6 text-center mb-4 ${
              isLoading ? 'bg-gray-200 cursor-not-allowed' : 'border-gray-400 hover:border-blue-500'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2">処理中...</span>
              </div>
            ) : (
              <div>
                <p className="text-gray-600">ここにCSVファイルをドロップ</p>
                <p className="text-sm text-gray-500 mt-2">
                  {selectedFile ? `選択中: ${selectedFile.name}` : '未選択'}
                </p>
              </div>
            )}
          </div>

          <button
            className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-700 text-white'
            }`}
            onClick={handleUpload}
            disabled={isLoading}
          >
            {isLoading ? '処理中...' : 'アップロード'}
          </button>

          {errorMessage && (
            <div className="text-red-500 text-center mt-4">
              {errorMessage}
            </div>
          )}

          <div className="mt-4 text-sm text-gray-600">
            <h2 className="font-bold mb-2">注意事項：</h2>
            <ul className="list-disc list-inside">
              <li>CSVファイルのみアップロード可能です</li>
              <li>必要なカラム：ID, BMI, sBP, dBP, BS, HbA1c, LDL, TG, AST, ALT, γGTP</li>
              <li>文字コードはUTF-8を推奨します</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FileUpload;