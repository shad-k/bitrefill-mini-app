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
    .select()
    .eq('id', id)
    .single();
  console.log({ drop });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(drop);
}
