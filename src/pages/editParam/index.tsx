import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

const Header = () => (
    <header className="bg-blue-500 text-white p-4">
        <h1>健康診断システム</h1>
    </header>
);

const Footer = () => (
    <footer className="bg-gray-200 text-center p-4">
        <p>&copy; 2025 健康診断システム</p>
    </footer>
);

const EditParam = () => {
    const [percentage, setPercentage] = useState<string>('');
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPercentage(e.target.value);
    };

    const handleConfirm = () => {
        router.push('/confirm');
    };

    const handleCancel = () => {
        setPercentage('');
    };

    return (
        <div className="min-h-screen h-full bg-gray-100">
            <Header />
            <div className="container mx-auto p-4">
                <h2 className="text-2xl font-bold mb-4">上位抽出割合編集画面</h2>
                <div className="mb-4">
                    <label htmlFor="percentage" className="block text-gray-700 text-sm font-bold mb-2">
                        上位抽出割合:
                    </label>
                    <input
                        type="number"
                        id="percentage"
                        value={percentage}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={handleConfirm}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                    >
                        設定変更確認
                    </button>
                    <button
                        onClick={handleCancel}
                        className="bg-gray-400 hover:bg-gray-500 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        キャンセル
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default EditParam;