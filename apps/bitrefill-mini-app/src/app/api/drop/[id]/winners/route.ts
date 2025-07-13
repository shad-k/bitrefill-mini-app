import { createClient } from '@/utils/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  console.log('Fetching drop with ID:', id);
  const supabase = await createClient();
  const { data: drop } = await supabase
    .from('drops')
    .select('orders')
    .eq('id', id)
    .single();

  const winners = drop?.orders?.map((order: any) => order.winner_fid);

  return NextResponse.json({ winners }, { status: 200 });
}
