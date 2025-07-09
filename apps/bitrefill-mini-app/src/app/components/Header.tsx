'use client';
import { NeynarAuthButton, SIWN_variant } from '@neynar/react';
import '@neynar/react/dist/style.css';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md h-10">
      <Link href="/" className="text-xl font-bold mr-auto">
        Bitrefill Drop
      </Link>
      <NeynarAuthButton
        className="h-full rounded-full flex items-center "
        label="Sign In"
        variant={SIWN_variant.FARCASTER}
      />
    </header>
  );
};

export default Header;
