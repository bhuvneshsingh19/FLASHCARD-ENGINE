import { useState, useEffect } from 'react';
import { Flashcard } from '@/types';
import toast from 'react-hot-toast';

export function useFlashcards(deckId: string) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!deckId) return;

    const fetchCards = async () => {
      try {
        const res = await fetch(`/api/decks/${deckId}`);
        const data = await res.json();
        
        // Filter: Show only cards where nextReview <= now
        const now = new Date();
        const dueCards = data.cards.filter((card: Flashcard) => 
          new Date(card.nextReview) <= now
        );

        setCards(dueCards.length > 0 ? dueCards : data.cards); // Fallback to all if none due
      } catch (err) {
        toast.error("Failed to load cards");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, [deckId]);

  return { cards, isLoading };
}