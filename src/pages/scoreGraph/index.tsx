import React, { useState, useEffect } from 'react';
import { Layout } from './Layout';
import { Header } from './Header';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const ScoreGraph = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClientComponentClient();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const { data: health_check_results, error } = await supabase
                    .from('health_check_results')
                    .select('total_score');

                if (error) {
                    throw error;
                }

                if (health_check_results) {
                    setData(health_check_results);
                }
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Layout>
                <Header />
                <div className="min-h-screen h-full flex items-center justify-center">
                    <p>Loading...</p>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <Header />
                <div className="min-h-screen h-full flex items-center justify-center">
                    <p>Error: {error}</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <Header />
            <div className="min-h-screen h-full p-4">
                <h1 className="text-2xl font-bold mb-4">スコア分布グラフ</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.map((item, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md p-4">
                            <p className="text-lg">Total Score: {item.total_score}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default ScoreGraph;
