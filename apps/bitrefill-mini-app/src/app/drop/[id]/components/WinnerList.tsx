'use client';
import { useEffect, useState } from 'react';
import { RevealCardButton } from './RevealCardButton';
import { useProfile } from '@farcaster/auth-kit';

export function WinnerList({ dropId }: { dropId: string }) {
  const [winners, setWinners] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const {
    profile: { fid },
  } = useProfile();

  useEffect(() => {
    fetch(`/api/drop/${dropId}/winners`)
      .then((res) => res.json())
      .then((data) => {
        setWinners(data.winners.map((w: string) => parseInt(w)) || []);
        setLoading(false);
      });
  }, [dropId]);

  if (loading) return <p className="text-sm text-gray-500">Loading winners…</p>;

  return (
    <div className="border rounded-lg p-4 bg-green-50">
      {fid && (
        <h3 className="text-md font-semibold text-green-800 mb-2">
          {winners.includes(fid) ? 'You have won🏅' : 'Sorry you have not won'}
        </h3>
      )}
      {fid && (
        <div>
          {winners.includes(fid) && (
            <RevealCardButton dropId={dropId} currentUserFid={fid} />
          )}
        </div>
      )}
    </div>
  );
}
