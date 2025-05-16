"use client";

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFlashwiseStore } from '@/hooks/use-flashwise-store';
import { CardList } from '@/components/card/CardList';
import { CreateCardDialog } from '@/components/card/CreateCardDialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function DeckDetailPage() {
  const params = useParams();
  const router = useRouter();
  const deckId = params.deckId as string;
  const { getDeckById, getCardsByDeck, getDueCardsCount, isLoading } = useFlashwiseStore();

  const deck = getDeckById(deckId);
  const cardCount = deck ? getCardsByDeck(deck.id).length : 0;
  const dueCardsCount = deck ? getDueCardsCount(deck.id) : 0;

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-6 w-3/4" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-40 rounded-lg" />
            <Skeleton className="h-40 rounded-lg" />
            <Skeleton className="h-40 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-semibold text-destructive">Deck Not Found</h2>
        <p className="text-muted-foreground">The deck you are looking for does not exist or has been deleted.</p>
        <Button onClick={() => router.push('/decks')} className="mt-4">Go to Decks</Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <Button variant="outline" size="sm" onClick={() => router.push('/decks')} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Decks
      </Button>

      <div className="mb-8 p-6 bg-card rounded-xl shadow-lg border border-border/50">
        <h1 className="text-3xl font-bold tracking-tight mb-2">{deck.name}</h1>
        {deck.description && <p className="text-muted-foreground mb-4">{deck.description}</p>}
        <div className="flex items-center gap-4 text-sm">
            <span>Total Cards: <Badge variant="secondary">{cardCount}</Badge></span>
            <span>Due for Review: <Badge variant={dueCardsCount > 0 ? "default" : "outline"} className={dueCardsCount > 0 ? "bg-primary text-primary-foreground" : ""}>{dueCardsCount}</Badge></span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Cards in this Deck</h2>
        <div className="flex gap-2">
          <CreateCardDialog deckId={deck.id} />
          <Link href={`/decks/${deck.id}/review`} passHref legacyBehavior>
            <Button variant="default" disabled={cardCount === 0 || dueCardsCount === 0}>
              <PlayCircle className="mr-2 h-4 w-4" /> Review Due Cards
            </Button>
          </Link>
        </div>
      </div>
      
      <CardList deck={deck} />
    </div>
  );
}
