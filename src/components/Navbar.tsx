"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { Brain, LayoutDashboard, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
              <Brain className="text-white" size={22} />
            </div>
            <span className="text-xl font-black text-slate-900 italic">FlashcardEngine</span>
          </Link>

          <div className="flex items-center gap-4">
            {!isSignedIn ? (
              <>
                <Button onClick={() => router.push("/login")} variant="ghost" className="font-bold text-slate-600">Login</Button>
                <Button onClick={() => router.push("/signup")} className="bg-blue-600 text-white px-6 rounded-xl font-bold shadow-lg shadow-blue-100">Get Started</Button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-6 mr-4">
                  {pathname !== "/dashboard" && (
                    <Link href="/dashboard" className="text-sm font-bold text-slate-500 hover:text-blue-600 flex items-center gap-2 transition-colors">
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                  )}
                  {pathname !== "/upload" && (
                    <Link href="/upload" className="text-sm font-bold text-slate-500 hover:text-blue-600 flex items-center gap-2 transition-colors">
                      <PlusCircle size={16} /> Create
                    </Link>
                  )}
                </div>
                <UserButton/>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}