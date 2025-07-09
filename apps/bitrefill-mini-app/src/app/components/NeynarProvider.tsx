'use client';
import { MiniAppProvider, NeynarContextProvider, Theme } from '@neynar/react';
const NeynarProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <MiniAppProvider>
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
    </MiniAppProvider>
  );
};

export default NeynarProvider;
