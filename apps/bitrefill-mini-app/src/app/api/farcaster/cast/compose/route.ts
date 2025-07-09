import { createClient } from '@/utils/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { dropId, text } = await req.json();
  const supabase = await createClient();

  // call Neynar to post cast
  const res = await fetch('https://api.neynar.com/v2/farcaster/cast', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NEYNAR_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  const data = await res.json();

  await supabase
    .from('drops')
    .update({ cast_hash: data.hash })
    .eq('id', dropId);

  return NextResponse.json({ hash: data.hash });
}
