import { useState } from 'react';
import { Flashcard, StudyQuality } from '@/types';
import toast from 'react-hot-toast';

export function useStudySession(cards: Flashcard[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const submitRating = async (quality: StudyQuality) => {
    const card = cards[currentIndex];

    try {
      const res = await fetch('/api/study', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId: card.id, quality }),
      });

      if (!res.ok) throw new Error("Sync failed");

      if (currentIndex < cards.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsFinished(true);
      }
    } catch (err) {
      toast.error("Progress not saved. Check connection.");
    }
  };

  return {
    currentCard: cards[currentIndex],
    currentIndex,
    isFinished,
    submitRating,
    progress: ((currentIndex + 1) / cards.length) * 100
  };
}