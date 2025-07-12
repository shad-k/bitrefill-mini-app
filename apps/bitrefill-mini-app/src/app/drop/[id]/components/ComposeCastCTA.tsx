import { useState } from 'react';
import { DropData } from '../type';
import { useNeynarContext } from '@neynar/react';

interface Props {
  drop: DropData;
}
const ComposeCastCTA: React.FC<Props> = ({ drop }) => {
  const [composingCast, setComposingCast] = useState(false);
  const { user } = useNeynarContext();

  const composeCast = async () => {
    setComposingCast(true);
    await fetch('/api/farcaster/cast/compose', {
      method: 'POST',
      body: JSON.stringify({
        dropId: drop.id,
        text: `🎁 ${drop.quantity} x $${drop.amount} ${
          drop.giftcard_name
        } drop is live! Deadline: ${new Date(drop.deadline).toLocaleString()}
        
        ${
          drop.criteria === 'reaction'
            ? 'React to this post to have a chance at winning a gift card!'
            : 'Reply to have a chance at winning a gift card!'
        }`,
        signerUuid: user?.signer_uuid,
      }),
    });
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
