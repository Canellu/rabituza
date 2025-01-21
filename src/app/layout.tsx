import {
  getKindeServerSession,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "./components/AuthProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rabituza",
  description: "Track & Train",
  appleWebApp: true,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated } = getKindeServerSession();

  return (
    <AuthProvider>
      <html lang="en">
        <head>
          {/* <script
            src="https://unpkg.com/react-scan/dist/auto.global.js"
            async
          /> */}
          <meta name="apple-mobile-web-app-title" content="Rabituza" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="black-translucent"
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-pattern `}
        >
          {!(await isAuthenticated()) ? (
            <div className="flex items-center justify-center min-h-screen flex-col gap-8">
              <LoginLink
                postLoginRedirectURL="/goals"
                className="bg-primary rounded-full px-6 py-3 font-medium flex gap-3"
              >
                Sign in
                <ArrowRight className="bg-white rounded-full p-1" />
              </LoginLink>
            </div>
          ) : (
            <div className="min-h-screen">{children}</div>
          )}
        </body>
      </html>
    </AuthProvider>
  );
}
