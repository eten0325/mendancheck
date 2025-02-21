import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaFileUpload, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Header } from './header';
import { Footer } from './footer';
import axios from 'axios';

const FileValidation = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      setErrorMessage('ファイルを選択してください。');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setValidationResult('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/api/validate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setValidationResult(response.data.result);
      } else {
        setErrorMessage('ファイルの検証に失敗しました。');
      }
    } catch (error: any) {
      setErrorMessage(`検証中にエラーが発生しました: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetryUpload = () => {
    setFile(null);
    setValidationResult('');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">ファイル検証画面</h1>

        <div className="mb-4">
          <label htmlFor="file-upload" className="block text-gray-700 text-sm font-bold mb-2">
            CSVファイルをアップロードしてください:
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <button
          onClick={handleFileUpload}
          disabled={isSubmitting}
          className={
            `bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50`
          }
        >
          {isSubmitting ? '検証中...' : '検証開始'}
        </button>

        {errorMessage && (
          <div className="mt-4 p-3 bg-red-200 text-red-700 rounded-md flex items-center">
            <FaTimesCircle className="mr-2" />
            {errorMessage}
          </div>
        )}

        {validationResult && (
          <div className="mt-4 p-3 bg-green-200 text-green-700 rounded-md flex items-center">
            <FaCheckCircle className="mr-2" />
            {validationResult}
            <button
              onClick={handleRetryUpload}
              className="ml-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
            >
              再アップロード
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default FileValidation;
