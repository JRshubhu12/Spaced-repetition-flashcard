"use client";

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFlashwiseStore } from '@/hooks/use-flashwise-store';
import { FlashcardViewer } from '@/components/flashcard/FlashcardViewer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckSquare, BadgeHelp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const deckId = params.deckId as string;
  
  const { getDeckById, getDueCards, recordReview, isLoading: storeLoading } = useFlashwiseStore();
  
  const [dueCards, setDueCards] = useState<ReturnType<typeof getDueCards>>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const deck = useMemo(() => getDeckById(deckId), [deckId, getDeckById]);

  useEffect(() => {
    if (!storeLoading && deckId) {
      const cardsToReview = getDueCards(deckId);
      setDueCards(cardsToReview);
      if (cardsToReview.length === 0) {
        setSessionCompleted(true);
      }
      setIsLoading(false);
    }
  }, [deckId, getDueCards, storeLoading]);

  const handleResponse = (cardId: string, response: 'know' | 'dont_know') => {
    recordReview(cardId, response);
    if (currentCardIndex < dueCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      setSessionCompleted(true);
    }
  };

  const currentCard = useMemo(() => {
    if (dueCards.length > 0 && currentCardIndex < dueCards.length) {
      return dueCards[currentCardIndex];
    }
    return null;
  }, [dueCards, currentCardIndex]);

  const progressPercentage = dueCards.length > 0 ? ((currentCardIndex + (sessionCompleted ? 1 : 0)) / dueCards.length) * 100 : 0;
  
  if (isLoading || storeLoading) {
    return (
      <div className="container mx-auto py-8 flex flex-col items-center gap-8">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-72 w-full max-w-md" />
        <Skeleton className="h-12 w-full max-w-xs" />
        <Skeleton className="h-4 w-full max-w-sm" />
      </div>
    );
  }

  if (!deck) {
     return (
      <div className="container mx-auto py-8 text-center">
        <BadgeHelp className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold">Deck Not Found</h2>
        <p className="text-muted-foreground mb-6">Could not load the deck for review.</p>
        <Button onClick={() => router.push('/decks')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go to Decks
        </Button>
      </div>
    );
  }

  if (sessionCompleted || !currentCard) {
    return (
      <div className="container mx-auto py-8 text-center">
        <CheckSquare className="mx-auto h-16 w-16 text-accent mb-4" />
        <h2 className="text-3xl font-bold mb-2">Review Session Completed!</h2>
        <p className="text-muted-foreground mb-6">
          {dueCards.length > 0 
            ? `You've reviewed all ${dueCards.length} due cards in this deck.`
            : "There were no cards due for review in this deck."}
        </p>
        <Button onClick={() => router.push(`/decks/${deckId}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Deck
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 flex flex-col items-center gap-6">
      <div className="w-full max-w-xl text-center">
        <h1 className="text-2xl font-bold mb-1">Reviewing: {deck.name}</h1>
        <p className="text-sm text-muted-foreground">
          Card {currentCardIndex + 1} of {dueCards.length}
        </p>
        <Progress value={progressPercentage} className="mt-3 h-2" />
      </div>
      
      <FlashcardViewer
        card={currentCard}
        onKnow={(cardId) => handleResponse(cardId, 'know')}
        onDontKnow={(cardId) => handleResponse(cardId, 'dont_know')}
        showFlipButton={true}
      />

      <Button variant="outline" size="sm" onClick={() => router.push(`/decks/${deckId}`)} className="mt-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> End Review
      </Button>
    </div>
  );
}
