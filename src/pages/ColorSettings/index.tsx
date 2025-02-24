import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { toast } from 'react-hot-toast';
import Layout from '@/components/Layout';

const ColorSettings = () => {
  const router = useRouter() as any;
  const supabase = createClientComponentClient<Database>();
  const [colors, setColors] = useState({
    a: '#4CAF50', // 緑
    b: '#FFC107', // 黄
    c: '#FF9800', // オレンジ
    d: '#F44336', // 赤
  });

  const handleColorChange = (rank: string, color: string) => {
    setColors(prev => ({
      ...prev,
      [rank.toLowerCase()]: color,
    }));
  };

  const handleSave = async () => {
    try {
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (authError || !session) {
        router.push('/login');
        return;
      }

      // 色設定を保存する処理（実際のデータベース操作はここに実装）
      toast.success('色設定を保存しました');
    } catch (error) {
      console.error('Error saving color settings:', error);
      toast.error('色設定の保存に失敗しました');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">色設定</h2>

              <div className="space-y-6">
                {Object.entries(colors).map(([rank, color]) => (
                  <div key={rank} className="flex items-center space-x-4">
                    <label className="w-24 text-sm font-medium text-gray-700">
                      ランク {rank.toUpperCase()}
                    </label>
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => handleColorChange(rank, e.target.value)}
                      className="h-8 w-8 rounded-md border border-gray-300 cursor-pointer"
                    />
                    <div
                      className="w-24 h-8 rounded"
                      style={{ backgroundColor: color }}
                    ></div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleSave}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  設定を保存
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ColorSettings;
