'use client';
import '@neynar/react/dist/style.css';
import Link from 'next/link';
import { SignInButton } from '@farcaster/auth-kit';

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md h-14">
      <Link href="/" className="text-xl font-bold mr-auto">
        Bitrefill Drop
      </Link>
      {/* <NeynarAuthButton
        
        label="Sign In"
        variant={SIWN_variant.FARCASTER}
      /> */}
      <SignInButton />
    </header>
  );
};

export default Header;
