'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ParamValue } from 'next/dist/server/request/params';
import { useNeynarContext } from '@neynar/react';
import { DropData } from './type';
import DropInfoCard from './components/DropInfoCard';
import CastPreview from './components/CastPreview';
import CreatorActions from './components/CreatorActions';
import VisitorActions from './components/VisitorActions';
import { WinnerList } from './components/WinnerList';
import { RevealCardButton } from './components/RevealCardButton';
import DropPageSignInCTA from './components/DropPageSignInCTA';

export default function DropPage() {
  const { id } = useParams();
  const [drop, setDrop] = useState<DropData | null>(null);
  const { user, isAuthenticated } = useNeynarContext();
  const [isLoading, setIsLoading] = useState(true);
  const isCreator = drop && user && user?.fid === parseInt(drop.created_by);
  const deadlinePassed = drop ? new Date(drop.deadline) < new Date() : false;

  const fetchDrop = async (id: ParamValue) => {
    const res = await fetch(`/api/drop/${id}`);
    const data = await res.json();
    setDrop(data);
    return data;
  };

  useEffect(() => {
    (async () => {
      await fetchDrop(id);
      setIsLoading(false);
    })();
    const interval = setInterval(async () => {
      const data = await fetchDrop(id);
      if (data.cast_hash) {
        clearInterval(interval);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [id]);

  if (isLoading || !drop) {
    return (
      <div className="max-w-xl mx-auto p-4 animate-pulse space-y-4">
        <div className="h-6 bg-gray-300 rounded w-1/3" />
        <div className="h-20 bg-gray-200 rounded" />
        <div className="h-16 bg-gray-200 rounded" />
        <div className="h-12 bg-gray-100 rounded" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">🎁 Drop Details</h1>

      <DropInfoCard
        name={drop.giftcard_name}
        amount={drop.amount}
        quantity={drop.quantity}
        deadline={drop.deadline}
      />

      {!isAuthenticated && <DropPageSignInCTA />}

      <CastPreview castHash={drop.cast_hash} />

      {deadlinePassed && isAuthenticated && (
        <>
          <WinnerList dropId={drop.id} />
          <RevealCardButton dropId={drop.id} currentUserFid={user?.fid} />
        </>
      )}

      {!deadlinePassed &&
        isAuthenticated &&
        (isCreator ? (
          <CreatorActions drop={drop} />
        ) : (
          <VisitorActions dropId={drop.id} />
        ))}
    </div>
  );
}
