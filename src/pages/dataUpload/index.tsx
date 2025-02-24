import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import { FaFileUpload } from 'react-icons/fa';
import Layout from '@/components/Layout';
import axios from 'axios';

const DataUpload = () => {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('ファイルを選択してください。');
      return;
    }

    setIsUploading(true);
    setUploadStatus('アップロード中...');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setUploadStatus('アップロード成功!');
        // Optionally, redirect or show a success message
      } else {
        setUploadStatus('アップロード失敗');
      }
    } catch (error: any) {
      setUploadStatus(`アップロードエラー: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen h-full bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <div>
                <h1 className="text-2xl font-semibold">データアップロード画面</h1>
              </div>
              <div {...getRootProps()} className="mt-6">
                <input {...getInputProps()} data-testid="file-input" onChange={handleFileChange} />
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600" data-testid="drop-area">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FaFileUpload className="w-8 h-8 text-blue-500" />
                      {selectedFile ? (
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          選択されたファイル: {selectedFile.name}
                        </p>
                      ) : (
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          ここにファイルをドロップするか、ファイルを選択してください
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        CSV ファイルをアップロード
                      </p>
                    </div>
                  </label>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="py-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  data-testid="upload-button"
                >
                  {isUploading ? 'アップロード中...' : 'アップロード'}
                </button>
              </div>
              {uploadStatus && (
                <p className="mt-4 text-center text-gray-700" data-testid="upload-status">
                  {uploadStatus}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DataUpload;
