"use client";

import { useState, useEffect } from 'react';
import type { Card as CardType } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFlashwiseStore } from '@/hooks/use-flashwise-store';
import { useToast } from '@/hooks/use-toast';

interface EditCardDialogProps {
  card: CardType | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCardDialog({ card, isOpen, onOpenChange }: EditCardDialogProps) {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const { updateCard } = useFlashwiseStore();
  const { toast } = useToast();

  useEffect(() => {
    if (card) {
      setFront(card.front);
      setBack(card.back);
    }
  }, [card]);

  const handleSubmit = () => {
    if (!card) return;
    if (!front.trim() || !back.trim()) {
      toast({
        title: "Front and Back Required",
        description: "Please provide content for both front and back of the card.",
        variant: "destructive",
      });
      return;
    }
    updateCard(card.id, { front, back });
    toast({
      title: "Card Updated",
      description: "The card has been successfully updated.",
    });
    onOpenChange(false);
  };

  if (!card) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Card</DialogTitle>
          <DialogDescription>
            Modify the content for the front and back of your flashcard.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-front">Front Content</Label>
            <Textarea
              id="edit-front"
              value={front}
              onChange={(e) => setFront(e.target.value)}
              placeholder="e.g., What is the capital of France?"
              rows={3}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-back">Back Content</Label>
            <Textarea
              id="edit-back"
              value={back}
              onChange={(e) => setBack(e.target.value)}
              placeholder="e.g., Paris"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
