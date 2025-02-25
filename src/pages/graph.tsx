import React from 'react';
import Layout from '@/components/Layout';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/supabase/types';

const Graph = () => {
  const supabase = createClientComponentClient<Database>();
  // ... 残りのコード
}; 