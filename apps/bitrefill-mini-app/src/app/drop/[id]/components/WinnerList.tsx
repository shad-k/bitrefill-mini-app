'use client';

import { useEffect, useState } from 'react';

type Winner = {
  fid: string;
  username: string;
};

export function WinnerList({ dropId }: { dropId: string }) {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/drop/${dropId}/winners`)
      .then((res) => res.json())
      .then((data) => {
        setWinners(data.winners || []);
        setLoading(false);
      });
  }, [dropId]);

  if (loading) return <p className="text-sm text-gray-500">Loading winners…</p>;

  return (
    <div className="border rounded-lg p-4 bg-green-50">
      <h3 className="text-md font-semibold text-green-800 mb-2">🏅 Winners</h3>
      <ul className="space-y-1 text-green-900 text-sm">
        {winners.map((w) => (
          <li key={w.fid}>@{w.username}</li>
        ))}
      </ul>
    </div>
  );
}
