import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Layout } from './Layout';

const ScoringResult = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [searchResults, setSearchResults] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('total_score');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [filterValue, setFilterValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    const [newSortKey, newSortOrder] = selectedValue.split(':');
    setSortKey(newSortKey);
    setSortOrder(newSortOrder);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterValue(event.target.value);
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('health_check_results')
        .select('*');

      if (error) {
        throw error;
      }

      setSearchResults(data || []);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'データの取得に失敗しました。');
      // Provide sample data in case of an error
      setSearchResults([
        { id: '1', user_id: 'user1', total_score: 75, bmi_evaluation: 'B', bmi: 26.2, systolic_blood_pressure: 130, diastolic_blood_pressure: 85, blood_sugar: 95, hba1c: 5.8, ldl_cholesterol: 110, tg: 140, ast: 25, alt: 30, gamma_gtp: 40 },
        { id: '2', user_id: 'user2', total_score: 90, bmi_evaluation: 'A', bmi: 22.5, systolic_blood_pressure: 120, diastolic_blood_pressure: 80, blood_sugar: 85, hba1c: 5.5, ldl_cholesterol: 100, tg: 120, ast: 20, alt: 25, gamma_gtp: 35 },
        { id: '3', user_id: 'user3', total_score: 60, bmi_evaluation: 'C', bmi: 28.5, systolic_blood_pressure: 140, diastolic_blood_pressure: 90, blood_sugar: 105, hba1c: 6.2, ldl_cholesterol: 130, tg: 160, ast: 35, alt: 40, gamma_gtp: 50 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredResults = searchResults.filter((result: any) =>
    result.user_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedResults = [...filteredResults].sort((a: any, b: any) => {
    const order = sortOrder === 'asc' ? 1 : -1;
    return (a[sortKey] - b[sortKey]) * order;
  });

  const finalResults = filterValue
    ? sortedResults.filter((result: any) => result.bmi_evaluation === filterValue)
    : sortedResults;

  return (
    <Layout>
      <div className="min-h-screen h-full bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">スコアリング結果一覧</h2>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="ユーザーIDで検索"
                  onChange={handleSearchChange}
                  className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="mb-4 flex space-x-4">
                <select
                  onChange={handleSortChange}
                  className="px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
                >
                  <option value="total_score:desc">スコア（降順）</option>
                  <option value="total_score:asc">スコア（昇順）</option>
                </select>

                <select
                  onChange={handleFilterChange}
                  className="px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
                >
                  <option value="">すべての評価</option>
                  <option value="A">A評価</option>
                  <option value="B">B評価</option>
                  <option value="C">C評価</option>
                </select>
              </div>

              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-red-500">Error: {error}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ユーザーID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">スコア</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">評価</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BMI</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">収縮期血圧</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">拡張期血圧</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">血糖値</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HbA1c</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LDLコレステロール</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TG</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AST</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ALT</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">γ-GTP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {finalResults.map((result: any) => (
                        <tr key={result.id} className="hover:bg-gray-100">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.user_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.total_score}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.bmi_evaluation}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.bmi}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.systolic_blood_pressure}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.diastolic_blood_pressure}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.blood_sugar}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.hba1c}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.ldl_cholesterol}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.tg}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.ast}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.alt}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.gamma_gtp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ScoringResult;
