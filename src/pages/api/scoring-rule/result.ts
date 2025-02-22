import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { ScoringResult } from '@/types/scoring';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { data, error } = await supabase
      .from('health_check_results')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching scoring results:', error);
      throw error;
    }

    if (!data) {
      return res.status(200).json([]);
    }

    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Error fetching scoring results:', error);
    return res.status(500).json({ message: error.message });
  }
}