"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface FlashcardProps {
  front: string;
  back: string;
}

export default function Flashcard({ front, back }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset flip state when the card content changes (moving to next card)
  useEffect(() => {
    setIsFlipped(false);
  }, [front]);

  return (
    <div 
      className="perspective-1000 w-full max-w-md h-80 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full preserve-3d transition-all duration-500"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20 
        }}
      >
        {/* Front Side */}
        <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 bg-white border-2 border-blue-100 rounded-[32px] shadow-xl shadow-blue-50">
          <span className="absolute top-6 left-8 text-xs font-bold text-blue-400 uppercase tracking-widest">
            Question
          </span>
          <h2 className="text-2xl font-bold text-center text-gray-800 font-heading leading-relaxed">
            {front}
          </h2>
          <p className="absolute bottom-8 text-sm text-gray-400 font-medium">
            Click to flip
          </p>
        </div>

        {/* Back Side (Rotated 180deg) */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center p-8 bg-blue-600 border-2 border-blue-500 rounded-[32px] shadow-2xl shadow-blue-200">
          <span className="absolute top-6 left-8 text-xs font-bold text-blue-200 uppercase tracking-widest">
            Explanation
          </span>
          <div className="overflow-y-auto max-h-[70%] custom-scrollbar">
             <p className="text-xl font-medium text-center text-white leading-relaxed">
              {back}
            </p>
          </div>
          <p className="absolute bottom-8 text-sm text-blue-200 font-medium">
            Click to see question again
          </p>
        </div>
      </motion.div>
    </div>
  );
}