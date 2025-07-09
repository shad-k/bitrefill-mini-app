import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: giftcards, error } = await supabase
    .from('giftcards')
    .select('*');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ products: giftcards });
}
