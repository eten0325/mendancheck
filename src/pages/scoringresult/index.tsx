import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import Layout from '@/components/Layout';
import { Bar } from 'react-chartjs-2';
import { ScoringResult as ScoringResultType, EVALUATION_COLORS } from '@/types/scoring';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ScoringResult = () => {
  const [searchResults, setSearchResults] = useState<ScoringResultType[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortKey, setSortKey] = useState<keyof ScoringResultType>('total_score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [topPercentage, setTopPercentage] = useState<number>(20);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    const [newSortKey, newSortOrder] = selectedValue.split(':') as [keyof ScoringResultType, 'asc' | 'desc'];
    setSortKey(newSortKey);
    setSortOrder(newSortOrder);
  };

  const handleTopPercentageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      setTopPercentage(value);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/scoring-rule/result');
      if (!response.ok) {
        throw new Error('スコアリング結果の取得に失敗しました');
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'データの取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredResults = searchResults.filter(result =>
    result.user_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedResults = [...filteredResults].sort((a, b) => {
    const order = sortOrder === 'asc' ? 1 : -1;
    const aValue = a[sortKey];
    const bValue = b[sortKey];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return order * aValue.localeCompare(bValue);
    }
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return order * (aValue - bValue);
    }
    return 0;
  });

  // 上位抽出
  const topResults = sortedResults.slice(0, Math.ceil(sortedResults.length * topPercentage / 100));

  // グラフデータの準備
  const scoreRanges = [
    '5', '6-10', '11-15', '16-20',
    '21-25', '26-30', '31-35', '36-40'
  ];
  const scoreDistribution = scoreRanges.map(range => {
    if (range === '5') {
      return sortedResults.filter(result => result.total_score === 5).length;
    }
    const [min, max] = range.split('-').map(Number);
    return sortedResults.filter(result => 
      result.total_score >= min && result.total_score <= max
    ).length;
  });

  const graphData = {
    labels: scoreRanges,
    datasets: [
      {
        label: '総スコア分布',
        data: scoreDistribution,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const graphOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '総スコア分布',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `件数: ${context.raw}`;
          },
          title: function(tooltipItems: any[]) {
            const range = tooltipItems[0].label;
            if (range === '5') {
              return '全項目A評価 (5点)';
            }
            return `スコア範囲: ${range}点`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        },
        title: {
          display: true,
          text: '件数'
        }
      },
      x: {
        title: {
          display: true,
          text: 'スコア'
        }
      }
    }
  };

  return (
    <Layout>
      <div className="min-h-screen h-full bg-gray-100 py-6">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">スコアリング結果一覧</h2>

          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 検索・ソート */}
            <div className="bg-white p-4 rounded-lg shadow">
              <input
                type="text"
                placeholder="ユーザーIDで検索"
                onChange={handleSearchChange}
                className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-blue-500 mb-4"
              />
              <select
                onChange={handleSortChange}
                className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
              >
                <option value="total_score:desc">スコア（降順）</option>
                <option value="total_score:asc">スコア（昇順）</option>
              </select>
            </div>

            {/* 上位抽出設定 */}
            <div className="bg-white p-4 rounded-lg shadow">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                上位抽出割合 (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={topPercentage}
                onChange={handleTopPercentageChange}
                className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* グラフ表示 */}
          <div className="mb-8 bg-white p-4 rounded-lg shadow">
            <Bar data={graphData} options={graphOptions} />
          </div>

          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2">データを読み込み中...</p>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">Error: {error}</div>
          ) : (
            <>
              {/* 上位抽出結果 */}
              <div className="mb-8 bg-white p-4 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">上位{topPercentage}%の結果</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ユーザーID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">総スコア</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topResults.map((result) => (
                        <tr key={result.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.user_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.total_score}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 全結果一覧 */}
              <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
                <h3 className="text-xl font-semibold mb-4">全結果一覧</h3>
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ユーザーID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">総スコア</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BMI</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">血圧</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">血糖</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">脂質</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">肝機能</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedResults.map((result) => (
                      <tr key={result.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {result.user_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {result.total_score}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${EVALUATION_COLORS[result.bmi_evaluation]}`}>
                          {result.bmi}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${EVALUATION_COLORS[result.blood_pressure_evaluation]}`}>
                          {result.systolic_blood_pressure}/{result.diastolic_blood_pressure}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${EVALUATION_COLORS[result.blood_sugar_evaluation]}`}>
                          BS: {result.blood_sugar}, HbA1c: {result.hba1c}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${EVALUATION_COLORS[result.lipid_evaluation]}`}>
                          LDL: {result.ldl_cholesterol}, TG: {result.tg}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${EVALUATION_COLORS[result.liver_function_evaluation]}`}>
                          AST: {result.ast}, ALT: {result.alt}, γ-GTP: {result.gamma_gtp}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ScoringResult;
