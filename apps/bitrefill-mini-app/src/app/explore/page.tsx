'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Drop {
  id: string;
  giftcard_name: string;
  amount: number;
  quantity: number;
  deadline: string;
  invoice_status: string;
  created_at: string;
}

export default function ExploreDropsPage() {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  useEffect(() => {
    fetch(`/api/drops/explore?page=${page}&limit=${limit}`)
      .then((res) => res.json())
      .then((data) => {
        setDrops(data.drops);
        setTotalPages(data.totalPages);
      });
  }, [page]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">🎁 Explore Drops</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drops.map((drop) => (
          <Link
            href={`/drop/${drop.id}`}
            key={drop.id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white"
          >
            <h2 className="text-xl font-semibold">{drop.giftcard_name}</h2>
            <p className="text-sm text-gray-600 mt-1">
              💰 Amount: ₹{drop.amount}
            </p>
            <p className="text-sm text-gray-600">🏆 Winners: {drop.quantity}</p>
            <p className="text-sm text-gray-600">
              ⏰ Ends: {new Date(drop.deadline).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Status: <span className="capitalize">{drop.invoice_status}</span>
            </p>
          </Link>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-10">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-4 py-2">
          {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
