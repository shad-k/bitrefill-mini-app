'use client';
import { sdk } from '@farcaster/miniapp-sdk';
import { useEffect } from 'react';
import '@farcaster/auth-kit/styles.css';
import { AuthKitProvider } from '@farcaster/auth-kit';

const config = {
  rpcUrl: 'https://mainnet.optimism.io',
  siweUri: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
  domain: process.env.NEXT_PUBLIC_APP_URL?.replace('https://', '').replace(
    '/',
    ''
  ),
};

const NeynarProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    (async () => {
      await sdk.actions.ready();
    })();
  }, []);
  return <AuthKitProvider config={config}>{children}</AuthKitProvider>;
};

export default NeynarProvider;
