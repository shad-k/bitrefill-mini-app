'use client';
import { useEffect, useState } from 'react';
import { DropStatus } from './components/DropStatus';
import { useParams } from 'next/navigation';

export default function DropPage() {
  const { id } = useParams();
  const [drop, setDrop] = useState<any>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/drop/${id}`);
      const data = await res.json();
      setDrop(data);
      if (data.cast_hash) {
        clearInterval(interval);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [id]);

  if (!drop) return <p>Loading...</p>;
  return <DropStatus drop={drop} />;
}
