import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaFileUpload } from 'react-icons/fa';
import Header from './Header';
import Footer from './Footer';
import axios from 'axios';

const Upload = () => {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('ファイルを選択してください。');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadStatus(response.data.message);
    } catch (error: any) {
      setUploadStatus(`アップロード失敗: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <Header />
      <main className="container mx-auto py-6">
        <div className="bg-white shadow-md rounded-md p-8">
          <h1 className="text-2xl font-semibold mb-4">健康診断データアップロード画面</h1>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FaFileUpload className="text-blue-500 text-4xl mb-4" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">クリックしてファイルを選択</span> またはドラッグ＆ドロップ
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  CSVファイルのみ対応
                </p>
              </div>
              <input id="dropzone-file" type="file" className="hidden" onChange={handleFileSelect} data-testid="file-input" />
            </label>
          </div>

          <div className="mt-4">
            <button
              onClick={handleFileUpload}
              disabled={!selectedFile}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="upload-button"
            >
              アップロード
            </button>
          </div>

          {uploadStatus && (
            <div className="mt-4 text-center" data-testid="upload-status">
              {uploadStatus}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Upload;
