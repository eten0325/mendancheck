import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FaDownload, FaSpinner } from 'react-icons/fa';

const useDownloadLogs = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadLogs = useCallback(async () => {
    setIsDownloading(true);
    setError(null);

    try {
      // Replace with your actual API endpoint for downloading logs
      const response = await fetch('/api/download-logs');

      if (!response.ok) {
        throw new Error('ログのダウンロードに失敗しました。');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'logs.txt'; // You can customize the filename
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Optionally, display a success message
      // alert('ログのダウンロードが完了しました。');

    } catch (e: any) {
      setError(e.message || 'ログのダウンロード中にエラーが発生しました。');
    } finally {
      setIsDownloading(false);
    }
  }, []);

  return {
    downloadLogs,
    isDownloading,
    error,
  };
};

const AdminLogsDownload = () => {
  const router = useRouter();
  const { downloadLogs, isDownloading, error } = useDownloadLogs();

  return (
    <div className="min-h-screen h-full bg-gray-100">
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">ログダウンロード</h1>
        <div className="bg-white shadow rounded-lg p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">エラー!</strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <button
            onClick={downloadLogs}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            disabled={isDownloading}
            role="button"
          >
            {isDownloading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                ダウンロード中...
              </>
            ) : (
              <>
                <FaDownload className="mr-2" />
                ダウンロード
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogsDownload;