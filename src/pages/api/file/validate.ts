import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'papaparse';

interface CsvRow {
  ID: string;
  BMI: string;
  sBP: string;
  dBP: string;
  BS: string;
  HbA1c: string;
  LDL: string;
  TG: string;
  AST: string;
  ALT: string;
  GTP: string;
}

interface ValidationError {
  row: number;
  column: string;
  value: string;
  reason: string;
}

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

    // CSVパース
    const { data, errors } = parse<CsvRow>(fileContent, {
      header: true,
      skipEmptyLines: true,
    });

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

    // バリデーションエラーを格納する配列
    const validationErrors: ValidationError[] = [];

    // 各行のデータを検証
    data.forEach((row, index) => {
      // 数値項目の検証
      const numericFields = {
        BMI: { min: 10, max: 50 },
        sBP: { min: 60, max: 200 },
        dBP: { min: 40, max: 130 },
        BS: { min: 50, max: 200 },
        HbA1c: { min: 4, max: 10 },
        LDL: { min: 30, max: 300 },
        TG: { min: 30, max: 1000 },
        AST: { min: 10, max: 200 },
        ALT: { min: 10, max: 200 },
        GTP: { min: 10, max: 500 }
      };

      Object.entries(numericFields).forEach(([field, range]) => {
        const value = parseFloat(row[field as keyof CsvRow]);
        if (isNaN(value)) {
          validationErrors.push({
            row: index + 1,
            column: field,
            value: row[field as keyof CsvRow],
            reason: '数値として解析できません',
          });
        } else if (value < range.min || value > range.max) {
          validationErrors.push({
            row: index + 1,
            column: field,
            value: row[field as keyof CsvRow],
            reason: `値が範囲外です (${range.min}～${range.max})`,
          });
        }
      });

      // IDの形式検証
      if (!/^\d{4,10}$/.test(row.ID)) {
        validationErrors.push({
          row: index + 1,
          column: 'ID',
          value: row.ID,
          reason: 'IDは4～10桁の数字である必要があります',
        });
      }
    });

    // バリデーション結果を返す
    return res.status(200).json({
      message: validationErrors.length === 0 ? 'Validation passed' : 'Validation failed',
      isValid: validationErrors.length === 0,
      errors: validationErrors,
      rowCount: data.length,
    });

  } catch (error: any) {
    console.error('Error validating file:', error);
    return res.status(500).json({
      message: 'Error validating file',
      error: error.message,
    });
  }
}
