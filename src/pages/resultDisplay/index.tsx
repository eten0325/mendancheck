import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FaSort, FaFilter } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Database } from '@/types/supabase';

type HealthCheckResult = Database['public']['Tables']['health_check_results']['Row'];

type ExtractedId = Database['public']['Tables']['extracted_ids']['Row'];

const ResultDisplay = () => {
    const [healthCheckResults, setHealthCheckResults] = useState<HealthCheckResult[]>([]);
    const [extractedIds, setExtractedIds] = useState<ExtractedId[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortKey, setSortKey] = useState<keyof HealthCheckResult | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [filterValue, setFilterValue] = useState('');
    const router = useRouter();
    const supabase = createClientComponentClient<Database>();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const { data: healthData, error: healthError } = await supabase
                    .from('health_check_results')
                    .select('*');

                if (healthError) {
                    console.error("Error fetching health check results:", healthError);
                    // Fallback data
                    setHealthCheckResults([
                        { id: '1', user_id: 'user1', bmi: 22.5, blood_pressure: 120, blood_sugar: 90, lipid: 150, liver_function: 20, total_score: 100, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), systolic_blood_pressure: 120, diastolic_blood_pressure: 80, hba1c: 5.5, ldl_cholesterol: 100, tg: 150, ast: 20, alt: 20, gamma_gtp: 20, bmi_score: 0, blood_pressure_score: 0, blood_sugar_score: 0, lipid_score: 0, liver_function_score: 0, bmi_evaluation: 'A', blood_pressure_evaluation: 'A', blood_sugar_evaluation: 'A', lipid_evaluation: 'A', liver_function_evaluation: 'A'  },
                        { id: '2', user_id: 'user2', bmi: 24.8, blood_pressure: 130, blood_sugar: 100, lipid: 180, liver_function: 25, total_score: 80, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), systolic_blood_pressure: 130, diastolic_blood_pressure: 90, hba1c: 5.8, ldl_cholesterol: 120, tg: 170, ast: 25, alt: 25, gamma_gtp: 25, bmi_score: 0, blood_pressure_score: 0, blood_sugar_score: 0, lipid_score: 0, liver_function_score: 0, bmi_evaluation: 'B', blood_pressure_evaluation: 'B', blood_sugar_evaluation: 'B', lipid_evaluation: 'B', liver_function_evaluation: 'B' },
                    ]);
                } else {
                    setHealthCheckResults(healthData || []);
                }

                const { data: extractedData, error: extractedError } = await supabase
                    .from('extracted_ids')
                    .select('*');

                if (extractedError) {
                    console.error("Error fetching extracted IDs:", extractedError);
                    setExtractedIds([
                        { id: '1', user_id: 'user1', total_score: 100, extracted_at: new Date().toISOString() },
                        { id: '2', user_id: 'user2', total_score: 80, extracted_at: new Date().toISOString() },
                    ]);

                } else {
                    setExtractedIds(extractedData || []);
                }

            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [supabase]);

    const handleSort = (key: keyof HealthCheckResult) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterValue(event.target.value);
    };

    const filteredResults = healthCheckResults.filter(result =>
        result.user_id?.toLowerCase().includes(filterValue.toLowerCase())
    );

    const sortedResults = sortKey
        ? [...filteredResults].sort((a, b) => {
            const valueA = a[sortKey];
            const valueB = b[sortKey];

            if (valueA == null || valueB == null) {
                return 0;
            }

            if (typeof valueA === 'number' && typeof valueB === 'number') {
                return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
            } else if (typeof valueA === 'string' && typeof valueB === 'string') {
                return sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
            } else {
                return 0;
            }
        })
        : filteredResults;

    // Data for score distribution chart
    const scoreDistributionData = healthCheckResults.map(result => ({
        user_id: result.user_id,
        total_score: result.total_score,
    }));

    if (loading) {
        return (
            <div className="min-h-screen h-full bg-gray-100 flex items-center justify-center">
                <div className="text-2xl font-semibold">ロード中...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen h-full bg-gray-100">
            <header className="bg-white shadow-md py-4">
                <div className="container mx-auto px-4">
                    <h1 className="text-2xl font-semibold">結果表示画面</h1>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">スコア分布グラフ</h2>
                    <BarChart width={600} height={300} data={scoreDistributionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="user_id" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="total_score" fill="#8884d8" />
                    </BarChart>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">上位抽出IDリスト</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="py-2 px-4 border-b">ID</th>
                                    <th className="py-2 px-4 border-b">ユーザーID</th>
                                    <th className="py-2 px-4 border-b">スコア</th>
                                    <th className="py-2 px-4 border-b">抽出日</th>
                                </tr>
                            </thead>
                            <tbody>
                                {extractedIds.map(item => (
                                    <tr key={item.id} className="hover:bg-gray-100">
                                        <td className="py-2 px-4 border-b">{item.id}</td>
                                        <td className="py-2 px-4 border-b">{item.user_id}</td>
                                        <td className="py-2 px-4 border-b">{item.total_score}</td>
                                        <td className="py-2 px-4 border-b">{item.extracted_at}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">評価結果表</h2>
                    <div className="flex items-center mb-4">
                        <input
                            type="text"
                            placeholder="ユーザーIDでフィルタ" // "Filter by User ID"
                            className="border rounded py-2 px-3 mr-2"
                            value={filterValue}
                            onChange={handleFilterChange}
                        />
                        <div className="flex items-center space-x-2">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
                                onClick={() => handleSort('total_score')}
                            >
                                <FaSort className="mr-2" /> {/* スコアでソート */}
                                スコアでソート
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="py-2 px-4 border-b">
                                        <button onClick={() => handleSort('user_id')} className="flex items-center">
                                            ユーザーID
                                            {sortKey === 'user_id' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
                                        </button>
                                    </th>
                                    <th className="py-2 px-4 border-b">
                                        <button onClick={() => handleSort('total_score')} className="flex items-center">
                                            合計スコア
                                            {sortKey === 'total_score' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
                                        </button>
                                    </th>
                                    <th className="py-2 px-4 border-b">
                                        <button onClick={() => handleSort('bmi')} className="flex items-center">
                                            BMI
                                            {sortKey === 'bmi' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
                                        </button>
                                    </th>
                                    <th className="py-2 px-4 border-b">
                                        <button onClick={() => handleSort('blood_pressure')} className="flex items-center">
                                            血圧
                                            {sortKey === 'blood_pressure' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
                                        </button>
                                    </th>
                                    <th className="py-2 px-4 border-b">
                                        <button onClick={() => handleSort('blood_sugar')} className="flex items-center">
                                            血糖値
                                            {sortKey === 'blood_sugar' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
                                        </button>
                                    </th>
                                    <th className="py-2 px-4 border-b">
                                        <button onClick={() => handleSort('lipid')} className="flex items-center">
                                            脂質
                                            {sortKey === 'lipid' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
                                        </button>
                                    </th>
                                    <th className="py-2 px-4 border-b">
                                        <button onClick={() => handleSort('liver_function')} className="flex items-center">
                                            肝機能
                                            {sortKey === 'liver_function' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
                                        </button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedResults.map(result => (
                                    <tr key={result.id} className="hover:bg-gray-100">
                                        <td className="py-2 px-4 border-b">{result.user_id}</td>
                                        <td className="py-2 px-4 border-b">{result.total_score}</td>
                                        <td className="py-2 px-4 border-b">{result.bmi}</td>
                                        <td className="py-2 px-4 border-b">{result.blood_pressure}</td>
                                        <td className="py-2 px-4 border-b">{result.blood_sugar}</td>
                                        <td className="py-2 px-4 border-b">{result.lipid}</td>
                                        <td className="py-2 px-4 border-b">{result.liver_function}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4">詳細データ表示領域</h2>
                    <p>グラフ上のデータにマウスオーバーすると、詳細が表示されます。</p>
                    <img src="https://placehold.co/600x300" alt="Placeholder" className="w-full h-auto" />
                </section>
            </main>

            <footer className="bg-gray-800 text-white py-4">
                <div className="container mx-auto px-4">
                    <p className="text-center">© 2025 健康診断システム</p>
                </div>
            </footer>
        </div>
    );
};

export default ResultDisplay;
