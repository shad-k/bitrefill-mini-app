import { NextRequest, NextResponse } from 'next/server';

const BITREFILL_API_URL = 'https://www.bitrefill.com/api/products/search';
const BITREFILL_API_KEY = process.env.BITREFILL_API_KEY!;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
  }

  try {
    const apiRes = await fetch(`${BITREFILL_API_URL}?q=${encodeURIComponent(query)}`, {
      headers: {
        'Authorization': `Bearer ${BITREFILL_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!apiRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch from Bitrefill' }, { status: apiRes.status });
    }

    const data = await apiRes.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}