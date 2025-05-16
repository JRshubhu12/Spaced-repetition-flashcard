"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input'; // Although not used, keeping consistent with deck dialog. Textarea is used.
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFlashwiseStore } from '@/hooks/use-flashwise-store';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreateCardDialogProps {
  deckId: string;
}

export function CreateCardDialog({ deckId }: CreateCardDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const { addCard } = useFlashwiseStore();
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!front.trim() || !back.trim()) {
      toast({
        title: "Front and Back Required",
        description: "Please provide content for both front and back of the card.",
        variant: "destructive",
      });
      return;
    }
    addCard(deckId, front, back);
    toast({
      title: "Card Added",
      description: "New card has been successfully added to the deck.",
    });
    setFront('');
    setBack('');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Card
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Card</DialogTitle>
          <DialogDescription>
            Enter the content for the front and back of your new flashcard.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="front">Front Content</Label>
            <Textarea
              id="front"
              value={front}
              onChange={(e) => setFront(e.target.value)}
              placeholder="e.g., What is the capital of France?"
              rows={3}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="back">Back Content</Label>
            <Textarea
              id="back"
              value={back}
              onChange={(e) => setBack(e.target.value)}
              placeholder="e.g., Paris"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>Save Card</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
