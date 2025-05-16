export interface Card {
  id: string;
  deckId: string;
  front: string;
  back: string;
  interval: number; // in days
  easeFactor: number; // typically starts at 2.5
  dueDate: string; // ISO string date, YYYY-MM-DD
  createdAt: string; // ISO string date
  updatedAt: string; // ISO string date
  history: Array<{ date: string; response: 'know' | 'dont_know' }>;
}

export interface Deck {
  id: string;
  name: string;
  description?: string;
  createdAt: string; // ISO string date
  updatedAt: string; // ISO string date
}
