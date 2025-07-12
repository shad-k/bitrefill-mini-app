'use client';

import { NeynarCastCard, useNeynarContext } from '@neynar/react';

const CastPreview = ({ castHash }: { castHash: string | null }) => {
  const { user } = useNeynarContext();
  if (!castHash) {
    return null;
  }
  return (
    <div className="border border-gray-200 p-3 rounded-lg shadow">
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
    </div>
  );
};

export default CastPreview;
