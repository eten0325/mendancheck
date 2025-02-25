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
        
        // カラム名の大文字小文字を統一（BMI, bmiなど）
        Object.keys(processedRow).forEach(key => {
          const upperKey = key.toUpperCase();
          if (['ID', 'BMI', 'SBP', 'DBP', 'BS', 'HBA1C', 'LDL', 'TG', 'AST', 'ALT', 'GTP', 'ΓGTP'].includes(upperKey)) {
            if (upperKey !== key) {
              processedRow[upperKey] = processedRow[key];
            }
          }
        });
        
        const result = generateScoringResult(processedRow);
        console.log(`Generated result for row ${index}:`, result);
        
        // total_scoreが存在することを確認
        if (result.total_score === undefined || result.total_score === null) {
          console.error(`ERROR: total_score is ${result.total_score} for row ${index}`);
          // デフォルト値を設定
          result.total_score = 0;
        }
        
        return result;
      });

      console.log('Final scoring results before DB insert:', scoringResults);
      
      // 各結果のフィールドを確認
      scoringResults.forEach((result, index) => {
        const requiredFields = [
          'id', 'user_id', 'total_score', 'bmi', 'bmi_evaluation',
          'systolic_blood_pressure', 'diastolic_blood_pressure', 'bp_evaluation',
          'blood_sugar', 'hba1c', 'glucose_evaluation',
          'ldl_cholesterol', 'tg', 'lipid_evaluation',
          'ast', 'alt', 'gamma_gtp', 'liver_evaluation'
        ];
        
        const missingFields = requiredFields.filter(field => 
          result[field as keyof ScoringResult] === undefined || 
          result[field as keyof ScoringResult] === null
        );
        
        if (missingFields.length > 0) {
          console.error(`Row ${index} is missing required fields:`, missingFields);
        }
      });
      
      // Supabaseにデータを保存
      const { error: insertError } = await supabase
        .from('health_check_results')
        .upsert(
          scoringResults.map(result => {
            // 必須フィールドが存在することを確認
            const data = {
              ...result,
              total_score: result.total_score || 0, // nullの場合は0を設定
              created_at: new Date().toISOString(),
            };
            
            // データベースのスキーマに合わせてフィールド名を変換
            return data;
          })
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
