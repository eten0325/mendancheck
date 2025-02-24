export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      health_check_results: {
        Row: {
          id: string
          user_id: string
          total_score: number
          bmi: number
          bmi_evaluation: string
          systolic_blood_pressure: number
          diastolic_blood_pressure: number
          bp_evaluation: string
          blood_sugar: number
          hba1c: number
          glucose_evaluation: string
          ldl_cholesterol: number
          tg: number
          lipid_evaluation: string
          ast: number
          alt: number
          gamma_gtp: number
          liver_evaluation: string
          created_at: string
        }
        Insert: {
          id: string
          user_id: string
          total_score: number
          bmi: number
          bmi_evaluation: string
          systolic_blood_pressure: number
          diastolic_blood_pressure: number
          bp_evaluation: string
          blood_sugar: number
          hba1c: number
          glucose_evaluation: string
          ldl_cholesterol: number
          tg: number
          lipid_evaluation: string
          ast: number
          alt: number
          gamma_gtp: number
          liver_evaluation: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_score?: number
          bmi?: number
          bmi_evaluation?: string
          systolic_blood_pressure?: number
          diastolic_blood_pressure?: number
          bp_evaluation?: string
          blood_sugar?: number
          hba1c?: number
          glucose_evaluation?: string
          ldl_cholesterol?: number
          tg?: number
          lipid_evaluation?: string
          ast?: number
          alt?: number
          gamma_gtp?: number
          liver_evaluation?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}