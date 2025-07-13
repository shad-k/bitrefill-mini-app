import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase';
import { neynarClient } from '@/utils/neynar';

function selectWinners(participantFids: string[], quantity: number): string[] {
  const shuffled = [...participantFids]; // clone the array to avoid mutation

  // Fisher-Yates shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, quantity);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  console.log('Fetching drop with ID:', id);
  const supabase = await createClient();
  const { data: drop } = await supabase
    .from('drops')
    .select('cast_hash, quantity, orders, created_by, criteria')
    .eq('id', id)
    .single();

  const criteria = drop?.criteria;
  if (criteria === 'reaction' && drop?.cast_hash) {
    const res = await fetch(
      `https://api.neynar.com/v2/farcaster/cast?identifier=${drop.cast_hash}&type=hash`,
      {
        method: 'GET',
        headers: { 'x-api-key': process.env.NEYNAR_API_KEY } as HeadersInit,
      }
    )
      .then((response) => response.json())
      .catch((err) => console.error(err));

    const reactions = res.cast.reactions;
    const participants = [
      ...reactions.likes.map((like: any) => like.fid),
      ...reactions.recasts.map((recast: any) => recast.fid),
    ];

    let winners = selectWinners(participants, drop?.quantity);

    if (winners.length === 0) {
      winners = [drop.created_by];
    }

    const updates = winners.map((fid, i) => ({
      ...drop.orders[i],
      winner_fid: fid,
    }));

    const { error: updateError } = await supabase
      .from('drops')
      .update({
        orders: updates,
      })
      .eq('id', id);

    if (updateError) {
      throw new Error(`Error updating drop orders: ${updateError.message}`);
    }

    return NextResponse.json(
      { message: `Winners declared for drop: ${id}`, winners },
      { status: 200 }
    );

    neynarClient.publishFrameNotifications({
      targetFids: [...winners.map((w) => parseInt(w))],
      notification: {
        target_url: `https://${process.env.APP_URL}/drop/${id}`,
        title: 'Winners revealed!',
        body: 'Check if you have won',
      },
    });
    // const options = {
    //   method: 'GET',
    //   headers: { 'API-KEY': process.env.WIELD_API_KEY },
    // };

    // await fetch(
    //   `https://build.wield.xyz/farcaster/v2/cast-reactions?castHash=${drop.cast_hash}`,
    //   options
    // )
    //   .then((response) => response.json())
    //   .then((response) => console.log(response))
    //   .catch((err) => console.error(err));
  } else if (criteria === 'reply' && drop?.cast_hash) {
    // const options = {
    //   method: 'GET',
    //   headers: { 'API-KEY': process.env.WIELD_API_KEY },
    // };
    // await fetch(
    //   `https://build.wield.xyz/farcaster/v2/cast-reactions?castHash=${drop.cast_hash}`,
    //   options
    // )
    //   .then((response) => response.json())
    //   .then((response) => console.log(response))
    //   .catch((err) => console.error(err));
  }
  return NextResponse.json(
    { message: `Winners declared for drop: ${id}` },
    { status: 200 }
  );
}
