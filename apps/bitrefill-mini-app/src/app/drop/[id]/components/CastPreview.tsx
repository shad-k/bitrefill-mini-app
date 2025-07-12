'use client';

import { NeynarCastCard, useNeynarContext } from '@neynar/react';
import { sdk } from '@farcaster/miniapp-sdk';

const CastPreview = ({ castHash }: { castHash: string | null }) => {
  const { user } = useNeynarContext();
  if (!castHash) {
    return null;
  }

  const handleCastClick = () => {
    sdk.actions.viewCast({
      hash: castHash,
    });
  };

  return (
    <button
      className="border border-gray-200 p-3 rounded-lg shadow"
      onClick={handleCastClick}
    >
      <NeynarCastCard
        type="hash"
        identifier={castHash}
        renderEmbeds={true}
        renderFrames={true}
        viewerFid={user?.fid}
        onFrameBtnPress={(_, localFrame, setLocalFrame) => {
          setLocalFrame(localFrame);
          return Promise.resolve(localFrame);
        }}
      />
    </button>
  );
};

export default CastPreview;
