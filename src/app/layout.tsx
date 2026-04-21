"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");

  return (
    <ClerkProvider>
      <html lang="en" data-scroll-behavior="smooth" style={{ scrollBehavior: 'smooth' }}>
        <body className={`${inter.variable} font-sans antialiased bg-slate-50 text-slate-900 min-h-screen flex flex-col`}>
          {!isAuthPage && <Navbar />}
          <main className="flex-grow">{children}</main>
          <Toaster position="top-center" richColors theme="light" />
        </body>
      </html>
    </ClerkProvider>
  );
}