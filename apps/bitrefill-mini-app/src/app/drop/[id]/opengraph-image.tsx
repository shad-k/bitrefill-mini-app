import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

// Image generation
export default async function Image({ params }: { params: { id: string } }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/drop/${params.id}`,
    {
      next: { revalidate: 60 },
    }
  );
  const drop = await res.json();

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            fontSize: 128,
            display: 'flex',
          }}
        >
          {drop.giftcard_name ?? 'Gift Card'} Drop
        </div>
        <div
          style={{
            fontSize: 64,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          🎁 Win a Bitrefill Gift Card!
          <br />
          {drop.criteria === 'reaction' ? 'React ❤️' : 'Reply 💬'} to this cast!
        </div>
      </div>
    )
  );
}
