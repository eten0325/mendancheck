import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/supabase/types';
import { v4 as uuidv4 } from 'uuid';

interface HealthCheckData {
  id: string;
  bmi: number;
  systolic_blood_pressure: number;
  diastolic_blood_pressure: number;
  blood_sugar: number;
  hba1c: number;
  ldl_cholesterol: number;
  tg: number;
  ast: number;
  alt: number;
  gamma_gtp: number;
  bmi_score: number;
  blood_pressure_score: number;
  blood_sugar_score: number;
  lipid_score: number;
  liver_function_score: number;
  total_score: number;
  bmi_evaluation: string;
  blood_pressure_evaluation: string;
  blood_sugar_evaluation: string;
  lipid_evaluation: string;
  liver_function_evaluation: string;
}

export default function Input() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setError(null);
    }
  };

  const processCSV = async (csvData: string) => {
    try {
      const lines = csvData.trim().split('\n');
      const headers = lines[0].split(',');
      const dataRows = lines.slice(1).filter(line => line.trim());

      for (const row of dataRows) {
        const values = row.split(',');
        
        // 数値データの検証
        const numericValues = values.slice(2).map(val => val.trim());
        if (numericValues.some(val => val === '' || isNaN(Number(val)))) {
          throw new Error('CSVファイルに無効な数値データが含まれています');
        }

        // 基本データとスコアリング情報を保存
        const data = {
          id: uuidv4(),
          user_id: 'default_user',
          bmi: parseFloat(values[2]),
          systolic_blood_pressure: parseInt(values[3]),
          diastolic_blood_pressure: parseInt(values[4]),
          blood_sugar: parseInt(values[5]),
          hba1c: parseFloat(values[6]),
          ldl_cholesterol: parseInt(values[7]),
          tg: parseInt(values[8]),
          ast: parseInt(values[9]),
          alt: parseInt(values[10]),
          gamma_gtp: parseInt(values[11]),
          created_at: new Date().toISOString(),
          // デフォルトのスコアと評価を追加
          bmi_score: 0,
          blood_pressure_score: 0,
          blood_sugar_score: 0,
          lipid_score: 0,
          liver_function_score: 0,
          total_score: 0,
          bmi_evaluation: 'C',
          blood_pressure_evaluation: 'C',
          blood_sugar_evaluation: 'C',
          lipid_evaluation: 'C',
          liver_function_evaluation: 'C'
        };

        console.log('Inserting data:', data);

        // Supabaseにデータを保存
        const { error: insertError } = await supabase
          .from('health_check_results')
          .insert([data])
          .select();

        if (insertError) {
          console.error('データ保存エラー:', insertError);
          throw new Error(`データの保存に失敗しました: ${insertError.message}`);
        }
      }
    } catch (err) {
      console.error('CSV処理エラー:', err);
      throw err;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError('ファイルを選択してください');
      return;
    }

    setLoading(true);
    try {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const csvData = event.target?.result as string;
          await processCSV(csvData);
          router.push('/scoringresult');
        } catch (err: any) {
          setError(err.message || 'CSVの処理中にエラーが発生しました');
          setLoading(false);
        }
      };

      reader.onerror = () => {
        setError('ファイルの読み込みに失敗しました');
        setLoading(false);
      };

      reader.readAsText(file);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">健康診断データ入力</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              戻る
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={loading || !file}
            >
              {loading ? 'アップロード中...' : 'アップロード'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
} 