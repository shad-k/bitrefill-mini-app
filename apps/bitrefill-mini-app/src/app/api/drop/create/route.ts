import { createClient } from '@/utils/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  console.log('Creating drop...');
  const body = await req.json();
  const { giftcard_id, amount, quantity, deadline, criteria, created_by } =
    body;

  const supabase = await createClient();

  const { data: drop, error } = await supabase
    .from('drops')
    .insert({
      giftcard_id,
      amount,
      quantity,
      deadline,
      criteria,
      created_by,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();
  console.log('Drop created in database', drop);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  console.log('Calling Bitrefill invoice API...');
  // Call Bitrefill invoice API
  const invoiceRes = await fetch(`${process.env.BITREFILL_API_URL}/invoices`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.BITREFILL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      products: [
        {
          product_id: giftcard_id,
          quantity,
          value: amount,
        },
      ],
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

  const { data: invoice } = await invoiceRes.json();

  console.log('Updating drop with invoice details...', invoice);
  await supabase
    .from('drops')
    .update({
      invoice_id: invoice.id,
      invoice_status: invoice.status,
      order_id: invoice?.orders?.[0]?.id ?? null,
      order_href: invoice?.orders?.[0]?._href ?? null,
    })
    .eq('id', drop.id);
  console.log('Drop updated with invoice details');
  return NextResponse.json({ dropId: drop.id });
}
