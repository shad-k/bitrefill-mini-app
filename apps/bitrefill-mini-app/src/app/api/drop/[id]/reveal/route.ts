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
  const { fid } = JSON.parse(req.body);

  // In real app, check eligibility from cast reactions
  const { data: drop, error } = await supabase
    .from('drops')
    .select('redemption_info')
    .eq('id', id)
    .single();

  if (error || !drop) {
    return res.status(404).json({ error: 'Drop not found' });
  }

  if (!drop.redemption_info?.code) {
    return res.status(400).json({ error: 'No code available' });
  }

  return res.status(200).json({ code: drop.redemption_info.code });
}
