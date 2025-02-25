import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { parse } from 'papaparse';
import { generateScoringResult } from '@/utils/scoring';
import { ScoringResult } from '@/types/scoring';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { fileContent } = req.body;

    if (!fileContent) {
      return res.status(400).json({ message: 'No file content provided' });
    }

    console.log('Received file content:', fileContent);

    // CSVパース
    const { data, errors } = parse<Record<string, string>>(fileContent, {
      header: true,
      skipEmptyLines: true,
    });

    console.log('Parsed data:', data);
    console.log('Parse errors:', errors);

    if (errors.length > 0) {
      return res.status(400).json({
        message: 'CSV parsing error',
        errors: errors,
      });
    }

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({
        message: 'No valid data found in CSV',
      });
    }

    const firstRow = data[0];
    console.log('First row:', firstRow);
    console.log('Available columns:', Object.keys(firstRow));

    // 必要なカラムの存在チェック
    const requiredColumns = [
      'ID', 'BMI', 'sBP', 'dBP', 'BS', 'HbA1c',
      'LDL', 'TG', 'AST', 'ALT'
    ];
    
    const missingColumns = requiredColumns.filter(
      col => !(col in firstRow)
    );
    
    // GTPまたはγGTPのどちらかが存在するか確認
    const hasGTP = 'GTP' in firstRow || 'γGTP' in firstRow;
    if (!hasGTP) {
      missingColumns.push('GTP/γGTP');
    }

    if (missingColumns.length > 0) {
      return res.status(400).json({
        message: 'Missing required columns',
        missingColumns: missingColumns,
        availableColumns: Object.keys(firstRow),
      });
    }

    // スコアリング処理
    try {
      const scoringResults: ScoringResult[] = data.map((row, index) => {
        console.log(`Processing row ${index}:`, row);
        // GTPとγGTPの処理を統一
        const processedRow = { ...row };
        if ('γGTP' in row) {
          processedRow.GTP = row['γGTP'];
        } else if ('GTP' in row) {
          processedRow['γGTP'] = row.GTP;
        }
        const result = generateScoringResult(processedRow);
        console.log(`Generated result for row ${index}:`, result);
        return result;
      });

      // Supabaseにデータを保存
      const { error: insertError } = await supabase
        .from('health_check_results')
        .upsert(
          scoringResults.map(result => ({
            ...result,
            created_at: new Date().toISOString(),
          }))
        );

      if (insertError) {
        console.error('Error inserting data:', insertError);
        throw insertError;
      }

      return res.status(200).json({
        message: 'Data processed and saved successfully',
        results: scoringResults,
      });

    } catch (error: any) {
      console.error('Error in scoring process:', error);
      return res.status(500).json({
        message: 'Error in scoring process',
        error: error.message,
        stack: error.stack,
      });
    }

  } catch (error: any) {
    console.error('Error processing file:', error);
    return res.status(500).json({
      message: 'Error processing file',
      error: error.message,
      stack: error.stack,
    });
  }
}
