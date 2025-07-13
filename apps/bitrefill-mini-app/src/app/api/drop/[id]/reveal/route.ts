import { createClient } from '@/utils/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const body = await req.json();
  const { fid } = body;
  const supabase = await createClient();
  const { data: drop } = await supabase
    .from('drops')
    .select('orders')
    .eq('id', id)
    .single();

  const order = drop?.orders.find(
    (order: any) => parseInt(order.winner_fid) === fid
  );
  const code = order.redemption_info.code ?? order.redemption_info.link;

  return NextResponse.json({ code }, { status: 200 });
}
