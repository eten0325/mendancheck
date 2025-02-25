import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/supabase/types';

interface HealthCheckData {
  bmi: number;
  systolic_blood_pressure: number;
  diastolic_blood_pressure: number;
  blood_sugar: number;
  hba1c: number;
  ldl_cholesterol: number;
  tg: number;
  ast: number;
  alt: number;
  gtp: number;
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
        const data: HealthCheckData = {
          bmi: parseFloat(values[2]),
          systolic_blood_pressure: parseInt(values[3]),
          diastolic_blood_pressure: parseInt(values[4]),
          blood_sugar: parseInt(values[5]),
          hba1c: parseFloat(values[6]),
          ldl_cholesterol: parseInt(values[7]),
          tg: parseInt(values[8]),
          ast: parseInt(values[9]),
          alt: parseInt(values[10]),
          gtp: parseInt(values[11])
        };

        // データの検証
        if (Object.values(data).some(value => isNaN(value))) {
          throw new Error('CSVファイルの数値データが不正です');
        }

        // Supabaseにデータを保存
        const { error: insertError } = await supabase
          .from('health_check_results')
          .insert([{
            ...data,
            user_id: (await supabase.auth.getUser()).data.user?.id || 'default_user',
            created_at: new Date().toISOString()
          }]);

        if (insertError) {
          console.error('データ保存エラー:', insertError);
          throw new Error('データの保存に失敗しました');
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