import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { getLlmModelAndGenerateContent } from '@/utils/functions';
import axios from 'axios';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface HealthCheckResult {
  test: string;
  data: string;
}

interface ApiResponse {
  message: string;
  data?: HealthCheckResult[];
}

export default async function fileParseHandler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '許可されていないメソッドです。' });
  }

  const { fileData } = req.body;

  if (!fileData) {
    return res.status(400).json({ message: 'ファイルデータがありません。' });
  }

  try {
    const csvData: string = fileData;
    const lines: string[] = csvData.split('
');
    const headers: string[] = lines[0].split(',');
    const parsedData: HealthCheckResult[] = [];

    for (let i = 1; i < lines.length; i++) {
      const data: string[] = lines[i].split(',');
      if (data.length !== headers.length) {
        throw new Error('CSVファイルの形式が正しくありません。');
      }
      const obj: any = {};
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j].trim()] = data[j].trim();
      }
      parsedData.push(obj);
    }

    // AI API リクエスト
    // const aiResponse = await getLlmModelAndGenerateContent(
    //   "Gemini",
    //   "あなたはCSVファイルを解析してJSON形式に変換するAIアシスタントです。",
    //   `CSVデータ: ${fileData}`
    // );

    // if (!aiResponse) {
    //   throw new Error('AI APIからの応答がありません。');
    // }

    // console.log("AI API Response:", aiResponse);

    // 仮のレスポンスデータ（AI APIの応答が失敗した場合）
    const sampleData: HealthCheckResult[] = [
      { test: '1', data: '2' }
    ];

    return res.status(200).json({
      message: 'CSVファイルの解析に成功しました。',
      data: sampleData, // parsedData, // Use sampleData for now
    });
  } catch (error: any) {
    console.error('CSVファイルの解析中にエラーが発生しました:', error);
    return res.status(500).json({ message: 'CSVファイルの解析中にエラーが発生しました。' });
  }
}