import { createClient } from '@/utils/supabase';
import { NextRequest, NextResponse } from 'next/server';
import {
  Errors,
  createClient as createFarcasterClient,
} from '@farcaster/quick-auth';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return NextResponse.json(
      { error: 'Authorization header missing' },
      { status: 401 }
    );
  }

  const supabase = await createClient();
  const farcasterClient = createFarcasterClient();

  try {
    await farcasterClient.verifyJwt({
      token: authHeader.split(' ')[1] as string,
      domain: process.env.APP_URL || '',
    });

    const body = await req.json();
    const { dropId, hash } = body;

    if (!dropId || !hash) {
      return NextResponse.json(
        { error: 'Missing dropId or castHash' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('drops')
      .update({ cast_hash: hash })
      .eq('id', dropId);

    if (error) {
      console.error('[update-cast] Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to update cast hash' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Cast hash updated successfully' },
      { status: 200 }
    );
  } catch (e) {
    if (e instanceof Errors.InvalidTokenError) {
      console.info('Invalid token:', e.message);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to update cast hash' },
      { status: 500 }
    );
  }
}
