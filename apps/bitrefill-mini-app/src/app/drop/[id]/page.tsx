'use client';
import { useEffect, useState } from 'react';
import { DropStatus } from './components/DropStatus';
import { useParams } from 'next/navigation';
import { ParamValue } from 'next/dist/server/request/params';
import {
  NeynarAuthButton,
  SIWN_variant,
  useNeynarContext,
} from '@neynar/react';
import DropCard from './components/DropCard';

export default function DropPage() {
  const { id } = useParams();
  const [drop, setDrop] = useState<any>(null);
  const { user, isAuthenticated } = useNeynarContext();

  const fetchDrop = async (id: ParamValue) => {
    const res = await fetch(`/api/drop/${id}`);
    const data = await res.json();
    setDrop(data);
    return data;
  };

  useEffect(() => {
    (async () => {
      await fetchDrop(id);
    })();
    const interval = setInterval(async () => {
      const data = await fetchDrop(id);
      if (data.cast_hash) {
        clearInterval(interval);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [id]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <NeynarAuthButton
          className="rounded-full flex items-center "
          label="Sign In"
          variant={SIWN_variant.FARCASTER}
        />
      </div>
    );
  }

  if (!drop) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-lg">Loading Drop...</p>
      </div>
    );
  }
  console.log({ user, drop });
  if (parseInt(drop.created_by) === user?.fid) {
    return <DropStatus drop={drop} />;
  }

  return <DropCard drop={drop} />;
}
