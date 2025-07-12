import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.DB_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  const { data: drop, error } = await supabase
    .from('drops')
    .select('id, cast_hash, quantity')
    .eq('id', id)
    .single();

  if (error || !drop) {
    return res.status(404).json({ error: 'Drop not found' });
  }

  // Dummy logic (replace with Farcaster/Neynar API result)
  const mockWinners = Array.from({ length: drop.quantity }).map((_, i) => ({
    fid: `123${i}`,
    username: `user${i}`,
  }));

  return res.status(200).json({ winners: mockWinners });
}
