import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Layout } from './_layout';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const supabase = useSupabaseClient();
  const router = useRouter();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
    setErrorMessage('');
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
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

    try {
      const { data, error } = await supabase.storage
        .from('health_check_results')
        .upload(`csv/${selectedFile.name}`, selectedFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('ファイルのアップロードエラー:', error);
        setErrorMessage('ファイルのアップロードに失敗しました。');
      } else {
        console.log('アップロード成功!', data);
        alert('アップロード成功!');
        //router.push('/uploadResult'); // アップロード結果画面に遷移する想定
      }
    } catch (err) {
      console.error('予期せぬエラー:', err);
      setErrorMessage('予期せぬエラーが発生しました。');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen h-full flex flex-col items-center justify-center bg-gray-100">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">ファイルアップロード画面</h1>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file-select">
              ファイルを選択：
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="file-select"
              type="file"
              onChange={handleFileSelect}
            />
          </div>

          <div
            id="drop-area"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-400 rounded p-6 text-center mb-4"
          >
            ドラッグアンドドロップエリア
          </div>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleUpload}
          >
            アップロード
          </button>

          {errorMessage && (
            <div className="text-red-500 text-center mt-4">
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FileUpload;