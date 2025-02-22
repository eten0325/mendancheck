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

    // 必要なカラムの存在チェック
    const requiredColumns = [
      'ID', 'BMI', 'sBP', 'dBP', 'BS', 'HbA1c',
      'LDL', 'TG', 'AST', 'ALT', 'GTP'
    ];

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({
        message: 'No valid data found in CSV',
      });
    }

    const firstRow = data[0];
    const missingColumns = requiredColumns.filter(
      col => !(col in firstRow)
    );

    if (missingColumns.length > 0) {
      return res.status(400).json({
        message: 'Missing required columns',
        missingColumns: missingColumns,
      });
    }

    // パース結果を返す
    return res.status(200).json({
      message: 'File parsed successfully',
      data: data,
      rowCount: data.length,
    });

  } catch (error: any) {
    console.error('Error parsing file:', error);
    return res.status(500).json({
      message: 'Error parsing file',
      error: error.message,
    });
  }
}