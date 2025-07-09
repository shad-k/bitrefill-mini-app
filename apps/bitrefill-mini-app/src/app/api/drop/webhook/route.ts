import { createClient } from '@/utils/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log('Webhook body:', body);
  const { id, status } = body;
  const supabase = await createClient();

  const { data: drop, error: dropError } = await supabase
    .from('drops')
    .select()
    .eq('invoice_id', id)
    .single();
  if (dropError) {
    console.error('Error fetching drop:', dropError);
    return NextResponse.json({ error: dropError.message }, { status: 500 });
  }

  console.log('Drop found:', drop);

  const orderId = drop.order_id;

  const orderRes = await fetch(
    `${process.env.BITREFILL_API_URL}/orders/${orderId}`,
    {
      headers: { Authorization: `Bearer ${process.env.BITREFILL_API_KEY}` },
    }
  );
  const order = await orderRes.json();
  console.log('Order details:', order);

  await supabase
    .from('drops')
    .update({
      invoice_status: status,
      redemption_info: order.data.redemption_info,
    })
    .eq('invoice_id', id);
  console.log('Drop updated with invoice status:', status);

  return NextResponse.json({ ok: true });
}
