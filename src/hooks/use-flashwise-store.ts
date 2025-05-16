
"use client";

import type { Deck, Card } from '@/types';
import { useState, useEffect, useCallback } from 'react';
import { calculateSrsParameters, INITIAL_EASE_FACTOR, isCardDue } from '@/lib/srs';
import { formatISO, startOfDay } from 'date-fns';

const DECKS_STORAGE_KEY = 'flashwise_decks';
const CARDS_STORAGE_KEY = 'flashwise_cards';

export function usePersistedState<T>(key: string, initialState: T): [T, (value: T | ((val: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialState;
    }
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialState;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialState;
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(state));
      } catch (error) {
        console.error(`Error writing localStorage key "${key}":`, error);
      }
    }
  }, [key, state]);

  return [state, setState];
}

export function useFlashwiseStore() {
  const [decks, setDecks] = usePersistedState<Deck[]>(DECKS_STORAGE_KEY, []);
  const [cards, setCards] = usePersistedState<Card[]>(CARDS_STORAGE_KEY, []);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false); 
  }, []);

  // Deck Operations
  const addDeck = useCallback((name: string, description?: string) => {
    const newDeck: Deck = {
      id: crypto.randomUUID(),
      name,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDecks(prev => [...prev, newDeck]);
    return newDeck;
  }, [setDecks]);

  const getDeckById = useCallback((deckId: string) => {
    return decks.find(d => d.id === deckId);
  }, [decks]);
  
  const updateDeck = useCallback((deckId: string, updates: Partial<Omit<Deck, 'id' | 'createdAt'>>) => {
    setDecks(prev => prev.map(d => d.id === deckId ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d));
  }, [setDecks]);

  const deleteDeck = useCallback((deckId: string) => {
    setDecks(prev => prev.filter(d => d.id !== deckId));
    setCards(prev => prev.filter(c => c.deckId !== deckId)); // Also delete associated cards
  }, [setDecks, setCards]);

  // Card Operations
  const addCard = useCallback((deckId: string, front: string, back: string, imageUrl?: string) => {
    const newCard: Card = {
      id: crypto.randomUUID(),
      deckId,
      front,
      back,
      imageUrl,
      interval: 0,
      easeFactor: INITIAL_EASE_FACTOR,
      dueDate: formatISO(startOfDay(new Date()), { representation: 'date' }),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [],
    };
    setCards(prev => [...prev, newCard]);
    return newCard;
  }, [setCards]);

  const getCardsByDeck = useCallback((deckId: string) => {
    return cards.filter(c => c.deckId === deckId).sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [cards]);
  
  const getCardById = useCallback((cardId: string) => {
    return cards.find(c => c.id === cardId);
  }, [cards]);

  const updateCard = useCallback((cardId: string, updates: { front?: string; back?: string; imageUrl?: string | null }) => {
    setCards(prev => prev.map(c => {
      if (c.id === cardId) {
        const updatedCard = { ...c, updatedAt: new Date().toISOString() };
        if (updates.front !== undefined) {
          updatedCard.front = updates.front;
        }
        if (updates.back !== undefined) {
          updatedCard.back = updates.back;
        }
        if (updates.imageUrl !== undefined) { // Check if imageUrl is part of the update payload
           updatedCard.imageUrl = updates.imageUrl === null ? undefined : updates.imageUrl;
        }
        return updatedCard;
      }
      return c;
    }));
  }, [setCards]);

  const deleteCard = useCallback((cardId: string) => {
    setCards(prev => prev.filter(c => c.id !== cardId));
  }, [setCards]);

  const recordReview = useCallback((cardId: string, response: 'know' | 'dont_know') => {
    const card = cards.find(c => c.id === cardId);
    if (card) {
      const updates = calculateSrsParameters({ card, response });
      setCards(prev => prev.map(c => c.id === cardId ? { ...c, ...updates } : c));
    }
  }, [cards, setCards]);

  const getDueCards = useCallback((deckId?: string) => {
    const today = new Date();
    return cards.filter(card => 
      (deckId ? card.deckId === deckId : true) && isCardDue(card, today)
    ).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [cards]);

  const getDueCardsCount = useCallback((deckId?: string) => {
    return getDueCards(deckId).length;
  }, [getDueCards]);
  
  const getOverallStats = useCallback(() => {
    const totalDecks = decks.length;
    const totalCards = cards.length;
    const today = new Date();
    const dueTodayCount = cards.filter(card => isCardDue(card, today)).length;
    
    const masteredCardsCount = cards.filter(card => card.interval > 21).length;
    const masteryPercentage = totalCards > 0 ? (masteredCardsCount / totalCards) * 100 : 0;

    return {
      totalDecks,
      totalCards,
      dueTodayCount,
      masteredCardsCount,
      masteryPercentage: parseFloat(masteryPercentage.toFixed(1)),
    };
  }, [decks, cards]);


  return {
    decks,
    addDeck,
    getDeckById,
    updateDeck,
    deleteDeck,
    cards,
    addCard,
    getCardsByDeck,
    getCardById,
    updateCard,
    deleteCard,
    recordReview,
    getDueCards,
    getDueCardsCount,
    getOverallStats,
    isLoading,
  };
}
