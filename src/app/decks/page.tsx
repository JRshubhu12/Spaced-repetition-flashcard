"use client";

import { DeckList } from '@/components/deck/DeckList';
import { CreateDeckDialog } from '@/components/deck/CreateDeckDialog';

export default function DecksPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Your Decks</h1>
        <CreateDeckDialog />
      </div>
      <DeckList />
    </div>
  );
}
