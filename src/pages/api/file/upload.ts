import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '許可されていないメソッドです' });
  }

  try {
    const { file, filename } = req.body;

    if (!file) {
      return res.status(400).json({ error: 'ファイル内容がありません。' });
    }

    if (!filename) {
      return res.status(400).json({ error: 'ファイル名がありません。' });
    }

    if (!filename.endsWith('.csv')) {
      return res.status(400).json({ error: '無効なファイル形式です。CSVファイルのみアップロード可能です。' });
    }

    // Supabase Storageへのファイルアップロード
    const bucketName = 'healthcheck';
    const filePath = `${uuidv4()}-${filename}`;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, { upsert: false });

    if (error) {
      console.error('ファイルのアップロードエラー:', error);
      return res.status(500).json({ error: 'ファイルのアップロードに失敗しました。' });
    }

    // ファイルの保存場所を返す
    const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucketName}/${filePath}`
    return res.status(200).json({ filePath: fileUrl });

  } catch (error: any) {
    console.error('APIエラー:', error);
    return res.status(500).json({ error: '予期せぬエラーが発生しました。' });
  }
}
