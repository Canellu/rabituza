import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import ProtectedRoute from './components/ProtectedRoute';
import { Providers } from './components/Providers';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Rabituza',
  description: 'Track & Train',
  appleWebApp: true,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const reactScanEnabled = process.env.NEXT_PUBLIC_REACT_SCAN === 'true';

  return (
    <html lang="en">
      <head>
        {reactScanEnabled && (
          <script
            src="https://unpkg.com/react-scan/dist/auto.global.js"
            async
          />
        )}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        />
        <meta name="apple-mobile-web-app-title" content="Rabituza" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-stone-50`}
      >
        <Providers>
          <ProtectedRoute>{children}</ProtectedRoute>
        </Providers>
      </body>
    </html>
  );
}
