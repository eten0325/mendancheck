// supabase/types.ts

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      health_check_results: {
        Row: {
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
        };
        Insert: {
          id?: string;
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
        };
        Update: {
          id?: string;
          bmi?: number;
          systolic_blood_pressure?: number;
          diastolic_blood_pressure?: number;
          blood_sugar?: number;
          hba1c?: number;
          ldl_cholesterol?: number;
          tg?: number;
          ast?: number;
          alt?: number;
          gamma_gtp?: number;
          bmi_score?: number;
          blood_pressure_score?: number;
          blood_sugar_score?: number;
          lipid_score?: number;
          liver_function_score?: number;
          total_score?: number;
          bmi_evaluation?: string;
          blood_pressure_evaluation?: string;
          blood_sugar_evaluation?: string;
          lipid_evaluation?: string;
          liver_function_evaluation?: string;
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
