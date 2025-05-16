"use client";

import { useState } from 'react';
import type { Card as CardType, Deck } from '@/types';
import { useFlashwiseStore } from '@/hooks/use-flashwise-store';
import { CardItem } from './CardItem';
import { EditCardDialog } from './EditCardDialog';
import { Skeleton } from '@/components/ui/skeleton';

interface CardListProps {
  deck: Deck;
}

export function CardList({ deck }: CardListProps) {
  const { getCardsByDeck, isLoading } = useFlashwiseStore();
  const cards = getCardsByDeck(deck.id);
  const [editingCard, setEditingCard] = useState<CardType | null>(null);

  const handleEditCard = (card: CardType) => {
    setEditingCard(card);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-lg" />
        ))}
      </div>
    );
  }
  
  if (cards.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">This deck has no cards yet. Add some to start learning!</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <CardItem key={card.id} card={card} onEdit={handleEditCard} />
        ))}
      </div>
      <EditCardDialog 
        card={editingCard} 
        isOpen={!!editingCard} 
        onOpenChange={(open) => { if (!open) setEditingCard(null); }} 
      />
    </>
  );
}
