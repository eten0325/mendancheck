import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { toast } from 'react-hot-toast';

const ColorSettings = () => {
    const [settings, setSettings] = useState<{
        bmi_color: string;
        blood_pressure_color: string;
        blood_sugar_color: string;
    }>({
        bmi_color: '#ff0000',
        blood_pressure_color: '#00ff00',
        blood_sugar_color: '#0000ff',
    });

    const supabase = createClientComponentClient<Database>();
    const router = useRouter();

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data, error } = await supabase
                    .from('settings')
                    .select('setting_key, setting_value')
                    .in('setting_key', ['bmi_color', 'blood_pressure_color', 'blood_sugar_color']);

                if (error) {
                    throw error;
                }

                if (data) {
                    const fetchedSettings: { [key: string]: string } = {};
                    data.forEach(item => {
                        fetchedSettings[item.setting_key] = item.setting_value as string;
                    });

                    setSettings(prevSettings => ({
                        ...prevSettings,
                        bmi_color: fetchedSettings['bmi_color'] || prevSettings.bmi_color,
                        blood_pressure_color: fetchedSettings['blood_pressure_color'] || prevSettings.blood_pressure_color,
                        blood_sugar_color: fetchedSettings['blood_sugar_color'] || prevSettings.blood_sugar_color,
                    }));
                }
            } catch (error: any) {
                console.error('設定の取得に失敗しました:', error.message);
                toast.error('設定の取得に失敗しました');
                // デフォルト値を設定
                setSettings({
                    bmi_color: '#ff0000',
                    blood_pressure_color: '#00ff00',
                    blood_sugar_color: '#0000ff',
                });
            }
        };

        fetchSettings();
    }, [supabase]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings(prevSettings => ({ ...prevSettings, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            // settings テーブルに更新または挿入する
            const updates = Object.entries(settings).map(([key, value]) => ({
                setting_key: key,
                setting_value: value,
                description: `色設定 (${key})` // 説明は必要に応じて調整
            }));

            // 各設定値を個別に更新または挿入
            for (const update of updates) {
                const { error } = await supabase
                    .from('settings')
                    .upsert(
                        update,
                        { onConflict: 'setting_key' }
                    );

                if (error) {
                    throw error;
                }
            }

            toast.success('設定が保存されました!');

        } catch (error: any) {
            console.error('設定の保存に失敗しました:', error.message);
            toast.error('設定の保存に失敗しました');
        }
    };

    return (
        <div className="min-h-screen h-full bg-gray-100">
            <Header />
            <div className="flex flex-row">
                <Sidebar />
                <main className="flex-1 p-4">
                    <h1 className="text-2xl font-semibold mb-4">色設定画面</h1>
                    <div className="mb-4">
                        <label htmlFor="bmi_color" className="block text-gray-700 text-sm font-bold mb-2">BMIの色:</label>
                        <input
                            type="color"
                            id="bmi_color"
                            name="bmi_color"
                            value={settings.bmi_color}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="blood_pressure_color" className="block text-gray-700 text-sm font-bold mb-2">血圧の色:</label>
                        <input
                            type="color"
                            id="blood_pressure_color"
                            name="blood_pressure_color"
                            value={settings.blood_pressure_color}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="blood_sugar_color" className="block text-gray-700 text-sm font-bold mb-2">血糖値の色:</label>
                        <input
                            type="color"
                            id="blood_sugar_color"
                            name="blood_sugar_color"
                            value={settings.blood_sugar_color}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        保存
                    </button>
                </main>
            </div>
            <Footer />
        </div>
    );
};

const Header = () => {
    return (
        <header className="bg-white shadow-md p-4">
            <h1 className="text-xl font-semibold">ヘッダー</h1>
        </header>
    );
};

const Footer = () => {
    return (
        <footer className="bg-white shadow-md p-4 text-center">
            <p>フッター</p>
        </footer>
    );
};

const Sidebar = () => {
    const router = useRouter();

    const menuItems = [
        { label: '色設定画面', href: '/ColorSettings' },
        // 他の画面へのリンクもここに追加
    ];

    return (
        <aside className="bg-gray-200 w-64 p-4">
            <nav>
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.href} className="mb-2">
                            <button
                                onClick={() => router.push(item.href)}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-300 rounded"
                            >
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default ColorSettings;
