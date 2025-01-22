import { createOrUpdateUser } from '@/lib/database/user/createOrUpdate';
import {
  getKindeServerSession,
  LoginLink,
} from '@kinde-oss/kinde-auth-nextjs/server';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
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
  const { isAuthenticated, getUser } = getKindeServerSession();

  const user = await getUser();

  // Call the Firestore user creation function
  if ((await isAuthenticated()) && user) {
    const userPayload = {
      id: user.id,
      profileData: {
        email: user.email || '',
        first_name: user.given_name || '',
        last_name: user.family_name || '',
      },
    };

    // Create or update user in Firestore
    await createOrUpdateUser(userPayload);
  }

  return (
    <html lang="en">
      <head>
        {reactScanEnabled && (
          <script
            src="https://unpkg.com/react-scan/dist/auto.global.js"
            async
          />
        )}
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
          {!(await isAuthenticated()) ? (
            <div className="flex items-center justify-center min-h-screen flex-col gap-8 bg-gradient-to-t from-stone-200 to-stone-50 via-stone-100">
              <LoginLink
                postLoginRedirectURL="/"
                className="from-primary to-primary/70 via-primary/90 bg-gradient-to-b  rounded-full px-4 items-center justify-center py-2 font-medium flex gap-3"
              >
                Sign in
                <ArrowRight className="bg-white rounded-full p-1" />
              </LoginLink>
            </div>
          ) : (
            <main className="min-h-screen">{children}</main>
          )}
        </Providers>
      </body>
    </html>
  );
}
