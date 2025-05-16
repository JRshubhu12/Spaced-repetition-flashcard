"use client";

import { useFlashwiseStore } from '@/hooks/use-flashwise-store';
import { DeckItem } from './DeckItem';
import { Skeleton } from '@/components/ui/skeleton';

export function DeckList() {
  const { decks, isLoading } = useFlashwiseStore();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-lg" />
        ))}
      </div>
    );
  }

  if (decks.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-semibold text-muted-foreground">No Decks Yet</h3>
        <p className="text-muted-foreground">Create your first deck to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {decks.map((deck) => (
        <DeckItem key={deck.id} deck={deck} />
      ))}
    </div>
  );
}
