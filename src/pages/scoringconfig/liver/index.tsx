import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/supabase';
import { Layout } from '@/components/Layout';

const LiverFunctionScoringRuleSetting = () => {
    const [astRange, setAstRange] = useState({
        min: '',
        max: '',
        score: '',
    });
    const [altRange, setAltRange] = useState({
        min: '',
        max: '',
        score: '',
    });
    const [gammaGtpRange, setGammaGtpRange] = useState({
        min: '',
        max: '',
        score: '',
    });

    const handleAstChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAstRange(prev => ({ ...prev, [name]: value }));
    };

    const handleAltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAltRange(prev => ({ ...prev, [name]: value }));
    };

    const handleGammaGtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setGammaGtpRange(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const { data, error } = await supabase
                .from('settings')
                .upsert([
                    {
                        setting_key: 'ast_range',
                        setting_value: astRange,
                    },
                    {
                        setting_key: 'alt_range',
                        setting_value: altRange,
                    },
                    {
                        setting_key: 'gamma_gtp_range',
                        setting_value: gammaGtpRange,
                    },
                ]);

            if (error) {
                console.error('設定の保存エラー:', error);
                alert('設定の保存中にエラーが発生しました。');
            } else {
                alert('設定が保存されました。');
            }
        } catch (error) {
            console.error('設定の保存エラー:', error);
            alert('設定の保存中にエラーが発生しました。');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: astData, error: astError } = await supabase
                    .from('settings')
                    .select('setting_value')
                    .eq('setting_key', 'ast_range')
                    .single();

                const { data: altData, error: altError } = await supabase
                    .from('settings')
                    .select('setting_value')
                    .eq('setting_key', 'alt_range')
                    .single();

                const { data: gammaGtpData, error: gammaGtpError } = await supabase
                    .from('settings')
                    .select('setting_value')
                    .eq('setting_key', 'gamma_gtp_range')
                    .single();

                if (astError) {
                    console.error('AST範囲の取得エラー:', astError);
                } else if (astData && astData.setting_value) {
                    setAstRange(astData.setting_value);
                }

                if (altError) {
                    console.error('ALT範囲の取得エラー:', altError);
                } else if (altData && altData.setting_value) {
                    setAltRange(altData.setting_value);
                }

                if (gammaGtpError) {
                    console.error('γGTP範囲の取得エラー:', gammaGtpError);
                } else if (gammaGtpData && gammaGtpData.setting_value) {
                    setGammaGtpRange(gammaGtpData.setting_value);
                }

            } catch (error) {
                console.error('データ取得エラー:', error);
                alert('データの取得中にエラーが発生しました。');
            }
        };

        fetchData();
    }, []);

    return (
        <Layout>
            <div className="container mx-auto p-4 min-h-screen h-full">
                <h1 className="text-2xl font-bold mb-4">肝機能スコアリングルール設定</h1>

                <div className="mb-4">
                    <h2 className="text-lg font-semibold mb-2">AST範囲</h2>
                    <div className="flex space-x-2">
                        <input
                            type="number"
                            name="min"
                            value={astRange.min}
                            onChange={handleAstChange}
                            placeholder="最小値"
                            className="border p-2 rounded w-1/3"
                            data-testid="ast-min"
                        />
                        <input
                            type="number"
                            name="max"
                            value={astRange.max}
                            onChange={handleAstChange}
                            placeholder="最大値"
                            className="border p-2 rounded w-1/3"
                            data-testid="ast-max"
                        />
                        <input
                            type="number"
                            name="score"
                            value={astRange.score}
                            onChange={handleAstChange}
                            placeholder="スコア"
                            className="border p-2 rounded w-1/3"
                            data-testid="ast-score"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <h2 className="text-lg font-semibold mb-2">ALT範囲</h2>
                    <div className="flex space-x-2">
                        <input
                            type="number"
                            name="min"
                            value={altRange.min}
                            onChange={handleAltChange}
                            placeholder="最小値"
                            className="border p-2 rounded w-1/3"
                            data-testid="alt-min"
                        />
                        <input
                            type="number"
                            name="max"
                            value={altRange.max}
                            onChange={handleAltChange}
                            placeholder="最大値"
                            className="border p-2 rounded w-1/3"
                            data-testid="alt-max"
                        />
                        <input
                            type="number"
                            name="score"
                            value={altRange.score}
                            onChange={handleAltChange}
                            placeholder="スコア"
                            className="border p-2 rounded w-1/3"
                            data-testid="alt-score"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <h2 className="text-lg font-semibold mb-2">γGTP範囲</h2>
                    <div className="flex space-x-2">
                        <input
                            type="number"
                            name="min"
                            value={gammaGtpRange.min}
                            onChange={handleGammaGtpChange}
                            placeholder="最小値"
                            className="border p-2 rounded w-1/3"
                            data-testid="gamma-gtp-min"
                        />
                        <input
                            type="number"
                            name="max"
                            value={gammaGtpRange.max}
                            onChange={handleGammaGtpChange}
                            placeholder="最大値"
                            className="border p-2 rounded w-1/3"
                            data-testid="gamma-gtp-max"
                        />
                        <input
                            type="number"
                            name="score"
                            value={gammaGtpRange.score}
                            onChange={handleGammaGtpChange}
                            placeholder="スコア"
                            className="border p-2 rounded w-1/3"
                            data-testid="gamma-gtp-score"
                        />
                    </div>
                </div>

                <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" data-testid="save-button">保存</button>
            </div>
        </Layout>
    );
};

export default LiverFunctionScoringRuleSetting;