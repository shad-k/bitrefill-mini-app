import { inngest } from '@/utils/inngest';
import { createClient } from '@/utils/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  console.log('Creating drop...');
  const body = await req.json();
  const {
    giftcard_id,
    giftcard_name,
    amount,
    package_id,
    quantity,
    deadline,
    criteria,
    created_by,
  } = body;

  const supabase = await createClient();

  const { data: drop, error } = await supabase
    .from('drops')
    .insert({
      giftcard_id,
      amount: package_id && package_id !== '' ? null : amount,
      package_id: package_id ?? null,
      quantity,
      deadline,
      criteria,
      created_by,
      giftcard_name,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();
  console.log('Drop created in database', drop);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  console.log('Calling Bitrefill invoice API...');
  // Call Bitrefill invoice API
  const product: Record<string, string | number> = {
    product_id: giftcard_id,
    quantity,
  };

  if (package_id) {
    product.package_id = package_id;
  } else {
    product.value = amount;
  }

  const invoiceRes = await fetch(`${process.env.BITREFILL_API_URL}/invoices`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.BITREFILL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      products: [product],
      payment_method: 'balance',
      webhook_url: `https://${req.headers.get('host')}/api/drop/webhook`,
      auto_pay: true,
    }),
  }).catch((error) => {
    console.error('Error calling Bitrefill invoice API:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  });

  const res = await invoiceRes.json();
  console.log({ res });
  const { data: invoice } = res;

  console.log('Updating drop with invoice details...', invoice);
  await supabase
    .from('drops')
    .update({
      invoice_id: invoice.id,
      invoice_status: invoice.status,
      orders:
        invoice?.orders?.map((order: any) => ({
          id: order.id,
          href: order._href,
          status: order.status ?? 'created',
        })) ?? [],
    })
    .eq('id', drop.id);
  console.log('Drop updated with invoice details');

  await inngest.send({
    name: 'drop/reveal.winners',
    data: {
      dateTime: deadline,
      dropId: drop.id,
    },
  });
  return NextResponse.json({ dropId: drop.id });
}
