import type { Card } from '@/types';
import { formatISO, addDays, parseISO, differenceInDays, startOfDay } from 'date-fns';

export const INITIAL_EASE_FACTOR = 2.5;

export interface SrsUpdateOptions {
  card: Card;
  response: 'know' | 'dont_know';
  currentDate?: Date; // For testing, defaults to now
}

export function calculateSrsParameters({ card, response, currentDate = new Date() }: SrsUpdateOptions): Partial<Card> {
  let newInterval: number;
  let newEaseFactor = card.easeFactor;
  const today = startOfDay(currentDate);

  if (response === 'know') {
    if (card.interval === 0) { // First successful review
      newInterval = 1;
    } else if (card.interval === 1) { // Second successful review
      newInterval = 6;
    } else {
      newInterval = Math.round(card.interval * newEaseFactor);
    }
    // Optionally, slightly increase easeFactor for correct answers, capped at a max (e.g., 3.5)
    // newEaseFactor = Math.min(3.5, newEaseFactor + 0.1); 
  } else { // 'dont_know'
    newInterval = 1; // Reset interval, show again tomorrow
    newEaseFactor = Math.max(1.3, newEaseFactor - 0.2); // Penalize easeFactor
  }

  const newDueDate = addDays(today, newInterval);

  return {
    interval: newInterval,
    easeFactor: newEaseFactor,
    dueDate: formatISO(newDueDate, { representation: 'date' }),
    history: [...card.history, { date: formatISO(today, { representation: 'date' }), response }],
    updatedAt: currentDate.toISOString(),
  };
}

export function isCardDue(card: Card, currentDate: Date = new Date()): boolean {
  const today = startOfDay(currentDate);
  const dueDate = startOfDay(parseISO(card.dueDate));
  return differenceInDays(dueDate, today) <= 0;
}
