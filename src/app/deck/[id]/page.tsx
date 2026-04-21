"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, ArrowLeft, CheckCircle2, RotateCcw, RefreshCw, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import confetti from "canvas-confetti";

export default function StudyPage() {
  const params = useParams();
  const router = useRouter();
  const [cards, setCards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  // 1. Fetch Deck Data
  useEffect(() => {
    const fetchDeck = async () => {
      try {
        const res = await fetch(`/api/decks/${params.id}`);
        const data = await res.json();
        setCards(data.cards || []);
      } catch (error) {
        toast.error("Failed to load deck");
      } finally {
        setLoading(false);
      }
    };
    fetchDeck();
  }, [params.id]);

  // 2. Celebration Logic
  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  // 3. SM-2 Rating Submission
  const handleRate = async (quality: number) => {
    const currentCard = cards[currentIndex];
    try {
      const res = await fetch("/api/study", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardId: currentCard.id,
          deckId: params.id,
          quality: quality,
        }),
      });

      if (!res.ok) throw new Error();

      if (currentIndex < cards.length - 1) {
        setIsFlipped(false);
        setTimeout(() => setCurrentIndex((prev) => prev + 1), 150);
      } else {
        setIsFinished(true);
        triggerConfetti();
      }
    } catch (error) {
      toast.error("Failed to save progress");
    }
  };

  const resetSession = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsFinished(false);
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <Brain className="animate-pulse text-blue-600" size={48} />
    </div>
  );

  // SUCCESS / FINISHED STATE
  if (isFinished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          className="bg-white p-12 rounded-[48px] shadow-2xl text-center max-w-lg w-full border border-slate-100 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-green-500" />
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Session Mastered!</h2>
          <p className="text-slate-500 mb-10 font-medium text-lg leading-relaxed px-4">
            Great job! Your mastery has been updated. Keep up the consistency!
          </p>
          
          <div className="flex flex-col gap-4">
            <Button 
              onClick={resetSession} 
              variant="outline"
              className="w-full h-16 border-2 border-slate-100 hover:bg-slate-50 text-slate-600 rounded-2xl font-bold text-lg gap-3"
            >
              <RefreshCw size={20} /> Practice Again
            </Button>
            
            <Button 
              onClick={() => router.push("/dashboard")} 
              className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-100 gap-3"
            >
              <LayoutDashboard size={20} /> Back to Library
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8 px-4">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-bold uppercase text-xs tracking-widest">
            <ArrowLeft size={16} /> Quit Session
          </button>
          <div className="bg-white px-5 py-2 rounded-full border border-slate-200 text-slate-500 font-bold text-xs tracking-tighter shadow-sm">
            CARD {currentIndex + 1} OF {cards.length}
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="w-full h-3 bg-slate-200 rounded-full mb-12 overflow-hidden shadow-inner">
          <motion.div 
            className="h-full bg-blue-600" 
            initial={{ width: 0 }} 
            animate={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }} 
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
          />
        </div>

        {/* 3D FLIP CARD UI */}
        <div className="card-container relative h-[480px] w-full" onClick={() => setIsFlipped(!isFlipped)}>
          <div className={`card-inner ${isFlipped ? 'is-flipped' : ''}`}>
            
            {/* FRONT FACE */}
            <div className="card-face card-front bg-white rounded-[48px] shadow-2xl shadow-blue-100/50 border border-slate-100 flex flex-col items-center justify-center p-12 text-center">
              <div className="absolute top-10 flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                <Brain size={12} /> Active Recall
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-[1.2] tracking-tight">
                {currentCard?.front}
              </h2>
              <p className="absolute bottom-10 text-slate-300 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                <RotateCcw size={14} /> Tap to reveal answer
              </p>
            </div>

            {/* BACK FACE */}
            <div className="card-face card-back bg-slate-900 rounded-[48px] shadow-2xl flex flex-col items-center justify-center p-12 text-center text-white">
              <div className="absolute top-10 bg-green-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                Verified Answer
              </div>
              <div className="text-2xl md:text-3xl font-medium leading-relaxed max-w-lg">
                {currentCard?.back}
              </div>
            </div>

          </div>
        </div>

        {/* SM-2 CONTROLS */}
        <div className="mt-12 min-h-[120px]">
          <AnimatePresence mode="wait">
            {isFlipped && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: 20 }}
                className="flex flex-col items-center"
              >
                <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mb-6">Rate your memory</p>
                <div className="grid grid-cols-5 gap-4 w-full">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      onClick={(e) => { e.stopPropagation(); handleRate(score); }}
                      className={`h-20 rounded-3xl font-black text-2xl transition-all active:scale-90 shadow-lg flex flex-col items-center justify-center border-b-4 ${
                        score <= 2 ? "bg-red-50 text-red-500 border-red-200 hover:bg-red-500 hover:text-white" : 
                        score === 3 ? "bg-orange-50 text-orange-500 border-orange-200 hover:bg-orange-500 hover:text-white" : 
                        "bg-green-50 text-green-500 border-green-200 hover:bg-green-500 hover:text-white"
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style jsx>{`
        .card-container { perspective: 2000px; }
        .card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-style: preserve-3d;
        }
        .is-flipped { transform: rotateY(180deg); }
        .card-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .card-back { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}