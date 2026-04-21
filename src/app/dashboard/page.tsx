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

  // 1. Fetch all data on mount
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/login");
    }

    const fetchDashboardData = async () => {
      try {
        const res = await fetch("/api/decks");
        const data = await res.json();
        setDecks(data);

        // Calculate Due Count: Cards with repetition 0 OR nextReview <= now
        // We do this on the client-side based on the fetched deck/card data
        let count = 0;
        data.forEach((deck: any) => {
          deck.cards?.forEach((card: any) => {
            const isNew = card.repetition === 0;
            const isDue = card.nextReview && new Date(card.nextReview) <= new Date();
            if (isNew || isDue) count++;
          });
        });
        setDueCount(count);
      } catch (err) {
        console.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (isSignedIn) fetchDashboardData();
  }, [isLoaded, isSignedIn, router]);

  // 2. Search Logic
  const filteredDecks = decks.filter((deck) =>
    deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (deck.description && deck.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // 3. Stats Calculation
  const totalDecks = decks.length;
  const avgMastery = totalDecks > 0 
    ? Math.round(decks.reduce((acc, d) => acc + (d.mastery || 0), 0) / totalDecks)
    : 0;

  if (!isLoaded || loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">Syncing Library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            My Learning Library
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Master your concepts through spaced repetition.
          </p>
        </div>
        <Link href="/upload">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-8 h-16 shadow-xl shadow-blue-200 gap-3 text-lg font-bold transition-all active:scale-95">
            <Plus size={20} /> Create New Deck
          </Button>
        </Link>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-[32px] shadow-sm border-l-8 border-blue-500">
          <p className="text-xs font-black text-slate-400 tracking-widest uppercase mb-2">Total Decks</p>
          <p className="text-4xl font-black text-blue-600">{totalDecks}</p>
        </div>
        <div className="bg-white p-8 rounded-[32px] shadow-sm border-l-8 border-orange-500">
          <p className="text-xs font-black text-slate-400 tracking-widest uppercase mb-2">Due for Review</p>
          <p className="text-4xl font-black text-orange-600">{dueCount}</p> 
        </div>
        <div className="bg-white p-8 rounded-[32px] shadow-sm border-l-8 border-green-500">
          <p className="text-xs font-black text-slate-400 tracking-widest uppercase mb-2">Avg Mastery</p>
          <p className="text-4xl font-black text-green-600">{avgMastery}%</p>
        </div>
      </div>

      {/* Search Bar */}
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

      {/* Decks Display */}
      {filteredDecks.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[48px] border-2 border-dashed border-slate-100">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="text-slate-300" size={40} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            {searchQuery ? "No matching decks" : "Your library is empty"}
          </h3>
          <p className="text-slate-500 font-medium">
            {searchQuery ? "Try a different search term" : "Upload a PDF to generate your first AI deck."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDecks.map((deck) => (
            <Link href={`/deck/${deck.id}`} key={deck.id} className="group">
              <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative h-full flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    deck.mastery > 70 ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"
                  }`}>
                    {deck.mastery || 0}% Mastered
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {deck.title}
                </h3>
                
                <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-8 flex-grow leading-relaxed">
                  {deck.description || "AI-generated study materials from your uploaded document."}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.1em]">
                    <Layout size={14} />
                    {deck._count?.cards || 0} Flashcards
                  </div>
                  <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlusCircle size={20} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}