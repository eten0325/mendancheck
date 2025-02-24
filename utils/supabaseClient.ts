import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 

// ↓ このインターフェース定義を削除してください。
// interface MockedNextRouter extends NextRouter {
//   pathname: string;
//   refresh: () => void;
// } 