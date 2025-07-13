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

  if (dropError || !drop) {
    console.error('Error fetching drop:', dropError);
    return NextResponse.json({ error: dropError?.message }, { status: 500 });
  }

  console.log('Drop found:', drop);

  const updatedOrders = await Promise.all(
    (drop.orders ?? []).map(async (order: any) => {
      const res = await fetch(
        `${process.env.BITREFILL_API_URL}/orders/${order.id}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.BITREFILL_API_KEY}`,
          },
        }
      );
      const orderRes = await res.json();
      return {
        ...order,
        status: orderRes.data?.status ?? order.status,
        redemption_info: orderRes.data?.redemption_info ?? null,
      };
    })
  );

  await supabase
    .from('drops')
    .update({
      invoice_status: status,
      orders: updatedOrders,
    })
    .eq('invoice_id', id);
  console.log('Drop updated with invoice status:', status);

  return NextResponse.json({ ok: true });
}
