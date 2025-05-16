
"use client";

import { useState, useEffect, type ChangeEvent } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFlashwiseStore } from '@/hooks/use-flashwise-store';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { ImagePlus, X } from 'lucide-react';

interface EditCardDialogProps {
  card: CardType | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCardDialog({ card, isOpen, onOpenChange }: EditCardDialogProps) {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { updateCard } = useFlashwiseStore();
  const { toast } = useToast();

  useEffect(() => {
    if (card) {
      setFront(card.front);
      setBack(card.back);
      setImagePreview(card.imageUrl || null);
    } else {
      // Reset form if card is null (e.g. dialog closed then reopened without a card)
      setFront('');
      setBack('');
      setImagePreview(null);
    }
  }, [card, isOpen]); // Re-run if isOpen changes, to reset if closed then opened without new card prop

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          title: "Image Too Large",
          description: "Please select an image smaller than 2MB.",
          variant: "destructive",
        });
        event.target.value = ""; // Clear the input
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // If file input is cleared by user, but an old image was there
      // This path might not be hit by typical browser "clear" action on file input
      // removeImage handles explicit removal
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    const fileInput = document.getElementById(`edit-image-upload-${card?.id}`) as HTMLInputElement;
    if (fileInput) {
        fileInput.value = "";
    }
  };

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
    updateCard(card.id, { front, back, imageUrl: imagePreview });
    toast({
      title: "Card Updated",
      description: "The card has been successfully updated.",
    });
    onOpenChange(false);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
        // Reset state related to image preview from current card if dialog is simply closed
        if(card?.imageUrl) {
            setImagePreview(card.imageUrl);
        } else {
            setImagePreview(null);
        }
         const fileInput = document.getElementById(`edit-image-upload-${card?.id}`) as HTMLInputElement;
        if (fileInput) {
            fileInput.value = "";
        }
    }
    onOpenChange(open);
  }

  if (!card) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Card</DialogTitle>
          <DialogDescription>
            Modify the content for the front and back of your flashcard.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor={`edit-front-${card.id}`}>Front Content</Label>
            <Textarea
              id={`edit-front-${card.id}`}
              value={front}
              onChange={(e) => setFront(e.target.value)}
              placeholder="e.g., What is the capital of France?"
              rows={3}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`edit-back-${card.id}`}>Back Content</Label>
            <Textarea
              id={`edit-back-${card.id}`}
              value={back}
              onChange={(e) => setBack(e.target.value)}
              placeholder="e.g., Paris"
              rows={3}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`edit-image-upload-${card.id}`}>Optional Image</Label>
             <div className="flex items-center gap-2">
                <Input
                  id={`edit-image-upload-${card.id}`}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="flex-grow"
                />
                {imagePreview && (
                  <Button variant="ghost" size="icon" onClick={removeImage} aria-label="Remove image">
                    <X className="h-4 w-4 text-destructive" />
                  </Button>
                )}
            </div>
            {imagePreview && (
              <div className="mt-2 relative w-full h-32 rounded border overflow-hidden">
                <Image src={imagePreview} alt="Image preview" layout="fill" objectFit="contain" />
              </div>
            )}
            {!imagePreview && (
                 <div className="mt-2 flex items-center justify-center w-full h-32 rounded border border-dashed text-muted-foreground">
                    <ImagePlus className="h-8 w-8" /> 
                 </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleDialogClose(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
