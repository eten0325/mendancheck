// supabase/types.ts

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      health_check_results: {
        Row: {
          id: string;
          bmi_score: number;
          blood_pressure_score: number;
          blood_sugar_score: number;
          lipid_score: number;
          liver_function_score: number;
          total_score: number;
        };
        Insert: {
          id?: string;
          bmi_score: number;
          blood_pressure_score: number;
          blood_sugar_score: number;
          lipid_score: number;
          liver_function_score: number;
          total_score: number;
        };
        Update: {
          id?: string;
          bmi_score?: number;
          blood_pressure_score?: number;
          blood_sugar_score?: number;
          lipid_score?: number;
          liver_function_score?: number;
          total_score?: number;
        };
      };
      logs: {
        Row: {
          id: number;
          timestamp: string;
          log_level: string;
          message: string;
        };
        Insert: {
          id?: number;
          timestamp?: string;
          log_level: string;
          message: string;
        };
        Update: {
          id?: number;
          timestamp?: string;
          log_level?: string;
          message?: string;
        };
      };
      // 他のテーブルがあれば追加
    };
  };
};
