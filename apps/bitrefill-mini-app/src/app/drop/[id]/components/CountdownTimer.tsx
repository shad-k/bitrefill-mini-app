'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';

export function CountdownTimer({ deadline }: { deadline: string }) {
  const [remaining, setRemaining] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const time = formatDistanceToNowStrict(new Date(deadline), {
        addSuffix: true,
      });
      setRemaining(time);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  return <p className="font-mono text-purple-600">{remaining}</p>;
}
