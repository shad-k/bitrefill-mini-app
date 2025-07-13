'use client';

import { useNeynarContext } from '@neynar/react';
import { useEffect, useState } from 'react';
import { RevealCardButton } from './RevealCardButton';

export function WinnerList({ dropId }: { dropId: string }) {
  const [winners, setWinners] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useNeynarContext();

  useEffect(() => {
    fetch(`/api/drop/${dropId}/winners`)
      .then((res) => res.json())
      .then((data) => {
        setWinners(data.winners.map((w: string) => parseInt(w)) || []);
        setLoading(false);
      });
  }, [dropId]);

  if (loading) return <p className="text-sm text-gray-500">Loading winners…</p>;

  console.log({ winners });

  return (
    <div className="border rounded-lg p-4 bg-green-50">
      {user?.fid && (
        <h3 className="text-md font-semibold text-green-800 mb-2">
          {winners.includes(user.fid)
            ? 'You have won🏅'
            : 'Sorry you have not won'}
        </h3>
      )}
      {user?.fid && (
        <div>
          {winners.includes(user.fid) && (
            <RevealCardButton dropId={dropId} currentUserFid={user?.fid} />
          )}
        </div>
      )}
    </div>
  );
}
