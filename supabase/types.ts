// supabase/types.ts

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
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
