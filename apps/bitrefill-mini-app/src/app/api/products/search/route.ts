import { createClient } from '@/utils/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');

  let query = supabase
    .from('giftcards')
    .select(
      'id, name, country_name, country_code, currency, image_url, in_stock'
    )
    .order('name');

  if (q) {
    query = query.or(`name.ilike.%${q}%`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
