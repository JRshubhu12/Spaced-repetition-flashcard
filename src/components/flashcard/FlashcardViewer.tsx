"use client";

import { useState, useEffect } from 'react';
import type { Card as CardType } from '@/types';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import styles from './flashcard-viewer.module.css'; // CSS Module for animations
import { cn } from '@/lib/utils';

interface FlashcardViewerProps {
  card: CardType;
  onKnow: (cardId: string) => void;
  onDontKnow: (cardId: string) => void;
  showFlipButton?: boolean;
}

export function FlashcardViewer({ card, onKnow, onDontKnow, showFlipButton = false }: FlashcardViewerProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset flip state when card changes
  useEffect(() => {
    setIsFlipped(false);
  }, [card]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleKnow = () => {
    if (!isFlipped) setIsFlipped(true); // Ensure back is shown before processing
    // Add a small delay to allow user to see the back if they clicked "Know" too fast on front
    setTimeout(() => onKnow(card.id), isFlipped ? 0 : 300);
  };

  const handleDontKnow = () => {
    if (!isFlipped) setIsFlipped(true); // Ensure back is shown
    setTimeout(() => onDontKnow(card.id), isFlipped ? 0 : 300);
  };

  return (
    <div className="flex flex-col items-center w-full gap-6">
      <div className={styles.flashcardContainer} onClick={!showFlipButton ? handleFlip : undefined}>
        <div className={cn(styles.flashcard, { [styles.isFlipped]: isFlipped })}>
          <div className={cn(styles.flashcardFace, styles.flashcardFront)}>
            <p className={styles.content}>{card.front}</p>
          </div>
          <div className={cn(styles.flashcardFace, styles.flashcardBack)}>
            <p className={styles.content}>{card.back}</p>
          </div>
        </div>
      </div>

      {showFlipButton && (
        <Button variant="outline" onClick={handleFlip} className="w-full max-w-xs">
          <RotateCcw className="mr-2 h-4 w-4" /> Flip Card
        </Button>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
        <Button
          variant="outline"
          className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          onClick={handleDontKnow}
          aria-label="Don't Know"
        >
          <XCircle className="mr-2 h-5 w-5" /> Don't Know
        </Button>
        <Button
          variant="default"
          className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={handleKnow}
          aria-label="Know"
        >
          <CheckCircle2 className="mr-2 h-5 w-5" /> Know
        </Button>
      </div>
    </div>
  );
}
