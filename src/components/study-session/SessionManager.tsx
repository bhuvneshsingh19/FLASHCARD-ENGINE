"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Flashcard from '@/components/flashcard/Card';
import { CheckCircle, ArrowRight, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface Card {
  id: string;
  front: string;
  back: string;
}

interface SessionManagerProps {
  deckTitle: string;
  cards: Card[];
  onFinish: () => void;
}

export default function SessionManager({ deckTitle, cards, onFinish }: SessionManagerProps) {
  const [index, setIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleRate = async (quality: number) => {
    try {
      // API call to update SM-2 stats
      await fetch('/api/study', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId: cards[index].id, quality }),
      });

      if (index < cards.length - 1) {
        setIndex(index + 1);
      } else {
        setCompleted(true);
        toast.success("Great job! Session complete.");
      }
    } catch (err) {
      toast.error("Failed to save progress");
    }
  };

  const progress = ((index + 1) / cards.length) * 100;

  if (completed) return <SuccessState onFinish={onFinish} />;

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col items-center gap-8 py-8 px-4">
      {/* Header Info */}
      <div className="w-full text-center space-y-2">
        <h2 className="text-sm font-bold text-blue-600 uppercase tracking-tighter italic">Active Recall Session</h2>
        <h1 className="text-2xl font-bold text-gray-900">{deckTitle}</h1>
      </div>

      {/* Progress Section */}
      <div className="w-full max-w-md">
        <div className="flex justify-between text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">
          <span>Card {index + 1} of {cards.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} color="bg-blue-600" />
      </div>

      {/* Flashcard with Entry Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          className="w-full flex justify-center"
        >
          <Flashcard front={cards[index].front} back={cards[index].back} />
        </motion.div>
      </AnimatePresence>

      {/* Feedback Controls */}
      <div className="w-full max-w-xl bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
        <p className="text-center text-sm font-bold text-gray-500 mb-6 uppercase tracking-widest">
          Rate your recall difficulty
        </p>
        <div className="flex gap-2 sm:gap-4 justify-center">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              onClick={() => handleRate(level)}
              className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl font-bold transition-all transform active:scale-90 ${
                level <= 2 ? 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white' :
                level === 3 ? 'bg-orange-50 text-orange-500 hover:bg-orange-500 hover:text-white' :
                'bg-green-50 text-green-500 hover:bg-green-500 hover:text-white'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
        <div className="flex justify-between mt-4 px-2 text-[10px] font-bold text-gray-300 uppercase">
          <span>Forgot</span>
          <span>Easy</span>
        </div>
      </div>
    </div>
  );
}

// Internal Success State Component
function SuccessState({ onFinish }: { onFinish: () => void }) {
  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      <div className="w-24 h-24 bg-green-100 rounded-[32px] flex items-center justify-center mb-6 text-green-600">
        <CheckCircle size={48} />
      </div>
      <h1 className="text-4xl font-black text-gray-900 mb-2 font-heading">Daily Mastery Achieved!</h1>
      <p className="text-gray-500 mb-10 max-w-md">
        You've reviewed all the cards in this set. Your brain is now officially 1% stronger.
      </p>
      <Button size="lg" onClick={onFinish} className="gap-2">
        Finish Session <ArrowRight size={20} />
      </Button>
    </motion.div>
  );
}