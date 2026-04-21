"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Layout, Search, Plus, Brain, Loader2, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { isLoaded, isSignedIn } = useUser();
  const [decks, setDecks] = useState<any[]>([]);
  const [dueCount, setDueCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/decks");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      
      setDecks(data);

      // Calculate "Due for Review"
      let totalDue = 0;
      const now = new Date();
      data.forEach((deck: any) => {
        if (deck.cards && Array.isArray(deck.cards)) {
          deck.cards.forEach((card: any) => {
            if (card.repetition === 0 || (card.nextReview && new Date(card.nextReview) <= now)) {
              totalDue++;
            }
          });
        }
      });
      setDueCount(totalDue);
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push("/login");
    if (isSignedIn) fetchDashboardData();
  }, [isLoaded, isSignedIn]);

  // If cards are still 0, refresh once after 5 seconds (AI generation guard)
  useEffect(() => {
    const anyEmpty = decks.some(d => (d._count?.cards || 0) === 0);
    if (decks.length > 0 && anyEmpty) {
      const timer = setTimeout(fetchDashboardData, 5000);
      return () => clearTimeout(timer);
    }
  }, [decks]);

  const filteredDecks = decks.filter((deck) =>
    deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (deck.description && deck.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!isLoaded || loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  const totalDecksCount = decks.length;
  const avgMastery = totalDecksCount > 0 
    ? Math.round(decks.reduce((acc, d) => acc + (d.mastery || 0), 0) / totalDecksCount)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">My Learning Library</h1>
          <p className="text-slate-500 font-medium text-lg">Master your concepts through spaced repetition.</p>
        </div>
        <Link href="/upload">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-8 h-16 shadow-xl shadow-blue-200 gap-3 text-lg font-bold transition-all active:scale-95">
            <Plus size={20} /> Create New Deck
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard title="Total Decks" value={totalDecksCount} color="blue" />
        <StatCard title="Due for Review" value={dueCount} color="orange" />
        <StatCard title="Avg Mastery" value={`${avgMastery}%`} color="green" />
      </div>

      <div className="relative mb-12">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by topic or title..."
          className="w-full h-20 pl-16 pr-6 rounded-[24px] border-none bg-white shadow-lg shadow-slate-200/50 focus:ring-2 focus:ring-blue-500 font-medium text-slate-600 text-lg outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDecks.map((deck) => {
          // THIS IS THE KEY FIX: Checking both possible sources of the card count
          const count = deck._count?.cards ?? deck.cards?.length ?? 0;

          return (
            <Link href={`/deck/${deck.id}`} key={deck.id} className="group">
              <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 h-full flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    deck.mastery >= 90 ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"
                  }`}>
                    {deck.mastery || 0}% Mastered
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {deck.title}
                </h3>
                
                <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-8 flex-grow leading-relaxed">
                  {deck.description || "AI-generated study material."}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.1em]">
                    <Layout size={14} />
                    {count > 0 ? `${count} Flashcards` : "Generating..."}
                  </div>
                  <PlusCircle size={20} className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: string | number; color: string }) {
  const styles: any = {
    blue: "border-blue-500 text-blue-600",
    orange: "border-orange-500 text-orange-600",
    green: "border-green-500 text-green-600"
  };
  return (
    <div className={`bg-white p-8 rounded-[32px] shadow-sm border-l-8 ${styles[color]}`}>
      <p className="text-xs font-black text-slate-400 tracking-widest uppercase mb-2">{title}</p>
      <p className="text-4xl font-black">{value}</p>
    </div>
  );
}