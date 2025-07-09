import { createClient } from '@/utils/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { isApiErrorResponse } from '@neynar/nodejs-sdk';
import { neynarClient } from '@/utils/neynar';

export async function POST(req: NextRequest) {
  const { dropId, text, signerUuid } = await req.json();
  const supabase = await createClient();

  try {
    const { cast } = await neynarClient.publishCast({
      signerUuid,
      text,
      embeds: [
        {
          url: `https://${req.headers.get('host')}/drop/${dropId}`,
        },
      ],
    });
    await supabase
      .from('drops')
      .update({ cast_hash: cast.hash })
      .eq('id', dropId);

    return NextResponse.json({ hash: cast.hash });
  } catch (err) {
    if (isApiErrorResponse(err)) {
      return NextResponse.json(
        { ...err.response.data },
        { status: err.response.status }
      );
    } else
      return NextResponse.json(
        { message: 'Something went wrong' },
        { status: 500 }
      );
  }
}
