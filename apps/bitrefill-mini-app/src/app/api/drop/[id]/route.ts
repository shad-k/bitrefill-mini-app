import { createClient } from '@/utils/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  console.log('Fetching drop with ID:', id);
  const supabase = await createClient();
  const { data: drop, error } = await supabase
    .from('drops')
    .select(
      'amount, cast_hash, created_at, created_by, criteria, drop_ended, giftcard_id, giftcard_name, id, invoice_id, invoice_status, package_id, quantity, deadline'
    )
    .eq('id', id)
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(drop);
}
