"use client";

import type { Card as CardType } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Edit3 } from 'lucide-react';
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
import { format, parseISO } from 'date-fns';

interface CardItemProps {
  card: CardType;
  onEdit: (card: CardType) => void;
}

export function CardItem({ card, onEdit }: CardItemProps) {
  const { deleteCard } = useFlashwiseStore();
  const { toast } = useToast();

  const handleDelete = () => {
    deleteCard(card.id);
    toast({
      title: "Card Deleted",
      description: `The card has been deleted.`,
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Front</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm truncate">{card.front}</p>
      </CardContent>
      <CardHeader className="pb-2 pt-2">
         <CardTitle className="text-base font-medium">Back</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-sm truncate">{card.back}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-2 border-t">
        <div className="text-xs text-muted-foreground">
            Due: <Badge variant={new Date(card.dueDate) <= new Date() ? "default" : "outline" } className="text-xs">{format(parseISO(card.dueDate), 'MMM dd, yyyy')}</Badge>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(card)}>
            <Edit3 className="h-4 w-4" />
          </Button>
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
                  This action cannot be undone. This will permanently delete this card.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
}
