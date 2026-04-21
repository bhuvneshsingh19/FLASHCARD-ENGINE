import { useState, useEffect } from 'react';
import { Deck } from '@/types';
import toast from 'react-hot-toast';

export function useDecks() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDecks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/decks');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setDecks(data);
    } catch (err) {
      toast.error("Could not load decks");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDeck = async (id: string) => {
    try {
      const res = await fetch(`/api/decks?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setDecks(prev => prev.filter(deck => deck.id !== id));
      toast.success("Deck deleted");
    } catch (err) {
      toast.error("Failed to delete deck");
    }
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  return { decks, isLoading, refresh: fetchDecks, deleteDeck };
}