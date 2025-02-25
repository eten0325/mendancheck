import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaArrowLeft } from 'react-icons/fa';
import Layout from '@/components/Layout';
import Header from '@/components/Header';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/supabase/types';

const TableSort = () => {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const [selectedSortCondition, setSelectedSortCondition] = useState<string>('');
  const [sortConditions, setSortConditions] = useState<{
    id: string;
    label: string;
    value: string;
  }[]>([
    { id: '1', label: 'スコア', value: 'score' },
    { id: '2', label: '名前', value: 'name' },
    { id: '3', label: '登録日', value: 'createdAt' },
    { id: '4', label: '更新日', value: 'updatedAt' },
  ]);

  useEffect(() => {
    const fetchSortSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('setting_value')
          .eq('setting_key', 'sort_condition')
          .limit(1)
          .single();

        if (error) {
          console.error('ソート設定の取得エラー:', error);
          // デフォルト値を設定
          setSelectedSortCondition('score');
        } else if (data && data.setting_value) {
          setSelectedSortCondition(data.setting_value.sort_condition || 'score');
        } else {
          // データがない場合、デフォルト値を設定
          setSelectedSortCondition('score');
        }
      } catch (error) {
        console.error('ソート設定の取得中にエラーが発生しました:', error);
        // エラーが発生した場合、デフォルト値を設定
        setSelectedSortCondition('score');
      }
    };

    fetchSortSettings();
  }, [supabase]);

  const handleSortConditionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSortCondition(event.target.value);
  };

  const handleSaveSortCondition = async () => {
    try {
      const { error } = await supabase
        .from('settings')
        .upsert([
          {
            setting_key: 'sort_condition',
            setting_value: { sort_condition: selectedSortCondition },
            description: '評価結果一覧のソート条件',
          },
        ],
        { onConflict: 'setting_key' });

      if (error) {
        console.error('ソート設定の保存エラー:', error);
        alert('ソート設定の保存に失敗しました。');
      } else {
        alert('ソート設定を保存しました。');
      }
    } catch (error) {
      console.error('ソート設定の保存中にエラーが発生しました:', error);
      alert('ソート設定の保存中にエラーが発生しました。');
    }
  };

  const handleGoBack = () => {
        router.push('/evalTable');
  };

  return (
    <Layout>
      <Header />
      <div className="min-h-screen h-full bg-gray-100">
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">ソート設定画面</h1>
          <button
              onClick={handleGoBack}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 flex items-center"
            >
              <FaArrowLeft className="mr-2" />
              評価結果一覧へ戻る
            </button>

          <div className="bg-white shadow rounded p-4 mb-4">
            <label htmlFor="sortCondition" className="block text-gray-700 text-sm font-bold mb-2">
              ソート条件:
            </label>
            <select
              id="sortCondition"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={selectedSortCondition}
              onChange={handleSortConditionChange}
            >
              {sortConditions.map((condition) => (
                <option key={condition.id} value={condition.value}>
                  {condition.label}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white shadow rounded p-4 mb-4">
            <p>選択されたソート条件: {selectedSortCondition}</p>
          </div>

          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleSaveSortCondition}
          >
            設定を保存する
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default TableSort;