import { NeynarCastCard, useNeynarContext } from '@neynar/react';

const DropCard = ({ drop }: { drop: any }) => {
  const { user } = useNeynarContext();

  return (
    <div className="max-w-xl mx-auto mt-8 p-4 border rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Gift Card Drop</h1>
      <p>Quantity: {drop.quantity}</p>
      <p>Amount: ${drop.amount}</p>
      <p className="mb-8">
        Criteria:{' '}
        {drop.criteria === 'reaction'
          ? 'React to the post to win'
          : 'Reply to the post to win'}
      </p>
      <NeynarCastCard
        type="hash"
        identifier={drop.cast_hash}
        renderEmbeds={true}
        renderFrames={true}
        viewerFid={user?.fid}
        onFrameBtnPress={(_, localFrame) => {
          return Promise.resolve(localFrame);
        }}
      />
    </div>
  );
};

export default DropCard;
