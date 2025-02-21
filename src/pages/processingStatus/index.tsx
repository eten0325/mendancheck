import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// common components
const Header = () => {
    return (
        <header className="bg-white shadow-md py-4 px-6">
            <h1 className="text-2xl font-semibold">健康診断結果評価システム</h1>
        </header>
    );
};

const Footer = () => {
    return (
        <footer className="bg-gray-100 py-4 px-6 text-center">
            <p>&copy; 2025 健康診断結果評価システム</p>
        </footer>
    );
};

const Sidebar = () => {
    const router = useRouter();

    const menuItems = [
        { label: 'ファイルアップロード', href: '/fileUpload' },
        { label: '処理状況画面', href: '/processingStatus' },
        { label: 'スコアリング設定', href: '/scoringConfig' },
        { label: 'スコアリング結果一覧', href: '/scoringResult' },
    ];

    return (
        <div className="w-64 bg-gray-50 min-h-screen h-full border-r border-gray-200">
            <div className="p-4">
                <h2 className="text-lg font-semibold mb-4">メニュー</h2>
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.label} className="mb-2">
                            <button
                                className="block w-full text-left py-2 px-4 rounded hover:bg-gray-100"
                                onClick={() => router.push(item.href)}
                            >
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const ProcessingStatus = () => {
    const [status, setStatus] = useState('CSVファイル処理中...');
    const [progress, setProgress] = useState(30);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Sample data (replace with actual data retrieval logic)
    const [sampleLogData, setSampleLogData] = useState([
        { id: 1, timestamp: new Date(), level: 'INFO', message: 'ファイルの検証を開始しました。' },
        { id: 2, timestamp: new Date(), level: 'INFO', message: 'データの読み込み中...' },
        { id: 3, timestamp: new Date(), level: 'WARN', message: 'いくつかのデータに不備が見つかりました。' },
    ]);

    useEffect(() => {
        // Simulate processing
        const interval = setInterval(() => {
            setProgress((prevProgress) => {
                const newProgress = prevProgress + 10;
                if (newProgress >= 100) {
                    clearInterval(interval);
                    setStatus('処理完了');
                    return 100;
                } else {
                    return newProgress;
                }
            });
        }, 500);

        return () => clearInterval(interval);
    }, []);

    const handleCancel = () => {
        setStatus('キャンセルされました');
        setProgress(0);
    };

    return (
        <div className="flex min-h-screen h-full bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 p-6">
                    <h1 className="text-2xl font-semibold mb-4">処理状況画面</h1>

                    <div className="mb-4">
                        <p className="text-gray-700">状態: {status}</p>
                        <progress className="w-full h-2" value={progress} max="100"></progress>
                        <p className="text-sm text-gray-500 mt-1">{progress}%</p>
                    </div>

                    <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleCancel}
                        disabled={status === '処理完了' || status === 'キャンセルされました'}
                    >
                        {status === '処理完了' || status === 'キャンセルされました' ? 'キャンセルできません' : 'キャンセル'}
                    </button>

                    {errorMessage && (
                        <div className="mt-4 text-red-500">
                            エラー: {errorMessage}
                        </div>
                    )}

                    <div className="mt-8">
                        <h2 className="text-lg font-semibold mb-2">ログ</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="py-2 px-4 border-b">ID</th>
                                        <th className="py-2 px-4 border-b">タイムスタンプ</th>
                                        <th className="py-2 px-4 border-b">レベル</th>
                                        <th className="py-2 px-4 border-b">メッセージ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sampleLogData.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50">
                                            <td className="py-2 px-4 border-b">{log.id}</td>
                                            <td className="py-2 px-4 border-b">{log.timestamp.toLocaleString()}</td>
                                            <td className="py-2 px-4 border-b">{log.level}</td>
                                            <td className="py-2 px-4 border-b">{log.message}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default ProcessingStatus;