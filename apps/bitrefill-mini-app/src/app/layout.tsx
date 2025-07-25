import type { Metadata } from 'next';
import { Inter, IBM_Plex_Sans } from 'next/font/google';
import './globals.css';
import NeynarProvider from './components/NeynarProvider';
import Header from './components/Header';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: '--font-ibm-plex-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://auth.farcaster.xyz" />
      </head>
      <body
        className={`${inter.variable} ${ibmPlexSans.variable} antialiased bg-gray-50 text-gray-800`}
      >
        <NeynarProvider>
          <Header />
          {children}
        </NeynarProvider>
      </body>
    </html>
  );
}
