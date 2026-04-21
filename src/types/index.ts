// --- Core Data Models (Sync with Prisma) ---

export interface Flashcard {
  id: string;
  deckId: string;
  front: string;
  back: string;
  
  // SM-2 Spaced Repetition Fields
  interval: number;    // Days until next review
  repetition: number;  // Number of times reviewed
  efactor: number;     // Ease factor (default 2.5)
  nextReview: Date | string; // Date for backend, string for JSON responses
}

export interface Deck {
  id: string;
  title: string;
  description?: string | null;
  createdAt: Date | string;
  cards?: Flashcard[];
  
  // Computed fields for UI/Dashboard
  _count?: {
    cards: number;
  };
  dueCount?: number; 
}

// --- API Request/Response Types ---

export interface GenerateRequest {
  text: string;
  title?: string;
  description?: string;
}

export interface StudyUpdatePayload {
  cardId: string;
  quality: number; // 1-5 scale
}

// --- UI & Application State Types ---

export type StudyQuality = 1 | 2 | 3 | 4 | 5;

export interface SessionState {
  currentIndex: number;
  isFinished: boolean;
  score: number;
}

export interface DashboardStats {
  totalDecks: number;
  totalCards: number;
  cardsDueToday: number;
  masteryLevel: number; // Percentage 0-100
}