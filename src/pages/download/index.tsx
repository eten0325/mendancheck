import React from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import Layout from '@/components/Layout';

const Download = () => {
    const router = useRouter();

    const handleCSVDownload = () => {
        alert('CSV形式でダウンロードします。');
    };

    const handlePDFDownload = () => {
        alert('PDF形式でダウンロードします。');
    };

    return (
        <Layout>
            <Header />
            <main className="flex-grow container mx-auto py-6 px-4">
                <h1 className="text-3xl font-semibold mb-4">ダウンロード選択画面</h1>
                <p className="mb-4">処理結果をCSVまたはPDF形式でダウンロードできます。</p>
                <div className="space-x-4">
                    <button
                        onClick={handleCSVDownload}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        CSV形式でダウンロード
                    </button>
                    <button
                        onClick={handlePDFDownload}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                        PDF形式でダウンロード
                    </button>
                </div>
            </main>
        </Layout>
    );
};

export default Download;