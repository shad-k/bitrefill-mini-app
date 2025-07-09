import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const res = await fetch(`${process.env.BITREFILL_API_URL}/products/${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.BITREFILL_API_KEY}`,
    },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: 'Failed to fetch giftcard' },
      { status: 500 }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
