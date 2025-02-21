import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Layout } from '../../components/Layout';
import { Header } from '../../components/Header';

const TableFilter = () => {
  const [filterValue, setFilterValue] = useState('');
  const [items, setItems] = useState(['item1', 'item2', 'item3']);
  const [filteredItems, setFilteredItems] = useState(items);
  const router = useRouter();

  useEffect(() => {
    // Initial data loading (replace with actual data fetching from Supabase if needed)
    // Example:
    // const fetchData = async () => {
    //   const { data, error } = await supabase.from('your_table').select('*');
    //   if (data) setItems(data.map(item => item.name)); // Adjust based on your table structure
    //   if (error) console.error("Error fetching data:", error);
    // };
    // fetchData();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilterValue(value);
    const newFilteredItems = items.filter(item => item.includes(value));
    setFilteredItems(newFilteredItems);
  };

  const handleSave = async () => {
    try {
      const response = await axios.post('/api/settings', { filter_condition: filterValue });
      if (response.status === 200) {
        alert('設定が保存されました。');
      } else {
        alert('設定の保存に失敗しました。');
      }
    } catch (error) {
      console.error('設定の保存に失敗しました:', error);
      alert('設定の保存に失敗しました。');
    }
  };

  return (
    <Layout>
      <Header />
      <div className="min-h-screen h-full bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <div>
                <h1 className="text-2xl font-semibold">フィルタ設定画面</h1>
              </div>
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <div className="relative">
                    <input
                      type="text"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                      placeholder="フィルタを入力してください"
                      value={filterValue}
                      onChange={handleFilterChange}
                    />
                    <label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                      フィルタ条件
                    </label>
                  </div>
                  <div className="relative">
                    <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                      保存
                    </button>
                  </div>
                  <ul className="list-disc list-inside">
                    {filteredItems.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TableFilter;
