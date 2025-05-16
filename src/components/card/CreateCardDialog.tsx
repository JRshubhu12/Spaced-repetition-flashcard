
"use client";

import { useState, type ChangeEvent } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFlashwiseStore } from '@/hooks/use-flashwise-store';
import { PlusCircle, ImagePlus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

interface CreateCardDialogProps {
  deckId: string;
}

export function CreateCardDialog({ deckId }: CreateCardDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { addCard } = useFlashwiseStore();
  const { toast } = useToast();

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
      setImagePreview(null);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    // Reset file input if you have a ref to it
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
        fileInput.value = "";
    }
  };

  const handleSubmit = () => {
    if (!front.trim() || !back.trim()) {
      toast({
        title: "Front and Back Required",
        description: "Please provide content for both front and back of the card.",
        variant: "destructive",
      });
      return;
    }
    addCard(deckId, front, back, imagePreview || undefined);
    toast({
      title: "Card Added",
      description: "New card has been successfully added to the deck.",
    });
    setFront('');
    setBack('');
    setImagePreview(null);
    removeImage(); // also clear file input
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset form on close
      setFront('');
      setBack('');
      removeImage();
    }
    setIsOpen(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Card
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Card</DialogTitle>
          <DialogDescription>
            Enter the content for the front and back, and optionally add an image.
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
          <div className="grid gap-2">
            <Label htmlFor="image-upload">Optional Image</Label>
            <div className="flex items-center gap-2">
              <Input
                id="image-upload"
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
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>Save Card</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
