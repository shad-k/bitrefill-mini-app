'use client';
import { sdk } from '@farcaster/miniapp-sdk';
import { useEffect } from 'react';
import '@farcaster/auth-kit/styles.css';
import { AuthKitProvider } from '@farcaster/auth-kit';
import { NeynarContextProvider, Theme } from '@neynar/react';

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
  return (
    <AuthKitProvider config={config}>
      <NeynarContextProvider
        settings={{
          clientId: process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID || '',
          defaultTheme: Theme.Dark,
          eventsCallbacks: {
            onAuthSuccess: () => {
              console.log('Neynar Auth Success');
            },
            onSignout() {
              console.log('Neynar Signout');
            },
          },
        }}
      >
        {children}
      </NeynarContextProvider>
    </AuthKitProvider>
  );
};

export default NeynarProvider;
