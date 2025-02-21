import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';
import { getLlmModelAndGenerateContent } from '@/utils/functions';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const { format } = req.body;
    const { data: user, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error('ユーザー認証エラー:', userError);
      return res.status(401).json({ error: '認証が必要です' });
    }

    const userId = user.user.id;

    const { data, error } = await supabase
      .from('health_check_results')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('データ取得エラー:', error);
      return res.status(500).json({ error: 'データ取得に失敗しました' });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'データが見つかりませんでした' });
    }

    if (format === 'csv') {
      const csv = convertToCSV(data);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="health_check_results_${new Date().toISOString()}.csv"`);
      return res.status(200).send(csv);
    } else if (format === 'pdf') {
      // TODO: PDF生成処理の実装
      //一旦は固定のPDFデータを返す
      const pdfBuffer = Buffer.from('PDF 形式のダウンロードはまだ実装されていません。', 'utf-8');

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="health_check_results_${new Date().toISOString()}.pdf"`);
      return res.status(200).send(pdfBuffer);


    } else {
      return res.status(400).json({ error: '無効な形式です' });
    }

  } catch (error: any) {
    console.error('ダウンロード処理エラー:', error);
    return res.status(500).json({ error: 'ダウンロード処理中にエラーが発生しました', details: error.message });
  }
}

function convertToCSV(data: any[]): string {
  if (!data || data.length === 0) {
    return '';
  }

  const headers = Object.keys(data[0]);
  const csvRows = [];

  csvRows.push(headers.join(','));

  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('
');
}
