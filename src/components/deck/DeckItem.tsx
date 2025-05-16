"use client";

import Link from 'next/link';
import type { Deck } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Edit3, PlayCircle, BarChartHorizontalBig } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useFlashwiseStore } from '@/hooks/use-flashwise-store';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface DeckItemProps {
  deck: Deck;
  // onEdit: (deckId: string) => void; // For future edit functionality
}

export function DeckItem({ deck }: DeckItemProps) {
  const { deleteDeck, getCardsByDeck, getDueCardsCount } = useFlashwiseStore();
  const { toast } = useToast();
  const cardCount = getCardsByDeck(deck.id).length;
  const dueCardsCount = getDueCardsCount(deck.id);

  const handleDelete = () => {
    deleteDeck(deck.id);
    toast({
      title: "Deck Deleted",
      description: `Deck "${deck.name}" and its cards have been deleted.`,
    });
  };

  return (
    <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-lg">{deck.name}</CardTitle>
        {deck.description && <CardDescription className="text-sm truncate">{deck.description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Total Cards:</span>
            <Badge variant="secondary">{cardCount}</Badge>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Due for Review:</span>
            <Badge variant={dueCardsCount > 0 ? "default" : "outline"} className={dueCardsCount > 0 ? "bg-primary text-primary-foreground" : ""}>
              {dueCardsCount}
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2 justify-end pt-4">
        <Link href={`/decks/${deck.id}/review`} passHref legacyBehavior>
          <Button variant="default" size="sm" className="w-full sm:w-auto" disabled={cardCount === 0 || dueCardsCount === 0}>
            <PlayCircle className="mr-2 h-4 w-4" /> Review
          </Button>
        </Link>
        <Link href={`/decks/${deck.id}`} passHref legacyBehavior>
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <BarChartHorizontalBig className="mr-2 h-4 w-4" /> Manage
          </Button>
        </Link>
        {/* Edit button placeholder
        <Button variant="ghost" size="icon" onClick={() => onEdit(deck.id)}>
          <Edit3 className="h-4 w-4" />
        </Button>
        */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the deck
                "{deck.name}" and all its associated cards.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
