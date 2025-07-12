import { useState } from 'react';
import { DropData } from '../type';
import { sdk } from '@farcaster/miniapp-sdk';

interface Props {
  drop: DropData;
}
const ComposeCastCTA: React.FC<Props> = ({ drop }) => {
  const [composingCast, setComposingCast] = useState(false);

  const composeCast = async () => {
    setComposingCast(true);
    const result = await sdk.actions.composeCast({
      text: `🎁 ${drop.quantity} lucky winner${
        drop.quantity > 1 ? 's' : ''
      } will win $${drop.amount} ${drop.giftcard_name}.
      Drop is live! Deadline: ${new Date(drop.deadline).toLocaleString()}
      ${
        drop.criteria === 'reaction'
          ? 'React to this post to have a chance at winning a gift card!'
          : 'Reply to have a chance at winning'
      }`,
      embeds: [`https://${process.env.NEXT_PUBLIC_APP_URL}/drop/${drop.id}`],
    });

    if (result?.cast) {
      await sdk.quickAuth.fetch('/api/drop/update-with-cast', {
        method: 'POST',
        body: JSON.stringify({
          hash: result.cast.hash,
          dropId: drop.id,
        }),
      });
    }
    setComposingCast(false);
  };

  return (
    <button
      className="bg-purple-600 text-white px-4 py-2 mt-4 rounded"
      onClick={composeCast}
      disabled={composingCast}
    >
      {composingCast ? 'Posting...' : 'Post Cast'}
    </button>
  );
};

export default ComposeCastCTA;
