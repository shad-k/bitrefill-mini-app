'use client';
import { NeynarCastCard, useNeynarContext } from '@neynar/react';
import { useEffect, useState } from 'react';

export function DropStatus({ drop }: { drop: any }) {
  const [castHash, setCastHash] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const { user } = useNeynarContext();

  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch(`/api/products/${drop.giftcard_id}`);
      if (res.ok) {
        const json = await res.json();
        setProduct(json?.data);
      }
    }
    if (drop.giftcard_id) fetchProduct();
  }, [drop.giftcard_id]);

  const composeCast = async () => {
    const res = await fetch('/api/farcaster/cast/compose', {
      method: 'POST',
      body: JSON.stringify({
        dropId: drop.id,
        text: `🎁 ${drop.quantity} x $${drop.amount} ${
          product.name
        } drop is live! Deadline: ${new Date(drop.deadline).toLocaleString()}`,
        signerUuid: user?.signer_uuid,
      }),
    });
    const { hash } = await res.json();
    setCastHash(hash);
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-4 border rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Gift Card Drop</h1>
      {product && (
        <div className="mb-4">
          <h2 className="text-lg font-bold">{product.name}</h2>
        </div>
      )}
      <p>Quantity: {drop.quantity}</p>
      <p>Amount: ${drop.amount}</p>
      {drop.invoice_status === 'all_delivered' && !drop.cast_hash && (
        <button
          className="bg-purple-600 text-white px-4 py-2 mt-4 rounded"
          onClick={composeCast}
        >
          Post Cast
        </button>
      )}
      {(!!drop.cast_hash || !!castHash) && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold">Cast Posted:</h3>
          <NeynarCastCard
            type="hash"
            identifier={drop.cast_hash || castHash}
            renderEmbeds={true}
          />
        </div>
      )}
    </div>
  );
}
