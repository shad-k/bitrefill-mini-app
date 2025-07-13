'use client';

import { useState } from 'react';
import Confetti from 'react-confetti';
import toast, { Toaster } from 'react-hot-toast';

export function RevealCardButton({
  dropId,
  currentUserFid,
}: {
  dropId: string;
  currentUserFid?: number;
}) {
  const [code, setCode] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  async function revealCode() {
    const res = await fetch(`/api/drop/${dropId}/reveal`, {
      method: 'POST',
      body: JSON.stringify({ fid: currentUserFid }),
    });
    const data = await res.json();
    setCode(data.code);
    setShowConfetti(true);
    toast.success('Gift card revealed!');
  }

  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      toast.success('Copied to clipboard!');
    }
  };

  return (
    <div className="border p-4 rounded bg-yellow-50 relative">
      <Toaster />
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}
      <h3 className="text-sm font-semibold text-yellow-700">
        🎉 You’re a winner!
      </h3>
      {code ? (
        <div className="mt-2 font-mono text-green-700 bg-white p-3 rounded border flex justify-between items-center">
          <span>{code}</span>
          <button
            onClick={handleCopy}
            className="text-sm text-blue-600 underline hover:text-blue-800 ml-4"
          >
            Copy
          </button>
        </div>
      ) : (
        <button
          onClick={revealCode}
          className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Reveal Gift Card
        </button>
      )}
    </div>
  );
}
