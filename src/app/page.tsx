"use client";

import Link from 'next/link';
import { useFlashwiseStore } from '@/hooks/use-flashwise-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, LayoutGrid, PlayCircle, BarChart3 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

export default function DashboardPage() {
  const { getDueCardsCount, getOverallStats, decks, cards, isLoading } = useFlashwiseStore();
  const overallDueCount = getDueCardsCount(); // All due cards across all decks
  const stats = getOverallStats();

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-8">
        <Skeleton className="h-12 w-1/2" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
        </div>
        <Skeleton className="h-60 rounded-lg" />
      </div>
    );
  }
  
  const hasDecksOrCards = decks.length > 0 || cards.length > 0;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-10 p-6 md:p-8 bg-gradient-to-r from-primary/10 via-background to-background rounded-lg shadow-sm flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Welcome to FlashWise!</h1>
          <p className="text-lg text-muted-foreground max-w-xl mb-6">
            Enhance your learning with smart flashcards and spaced repetition. Let's get started!
          </p>
          {!hasDecksOrCards && (
             <Link href="/decks" passHref legacyBehavior>
                <Button size="lg">Create Your First Deck</Button>
              </Link>
          )}
        </div>
        <div className="hidden md:block mt-6 md:mt-0">
          <Image 
            src="https://placehold.co/300x200.png"
            alt="Learning illustration"
            width={300}
            height={200}
            className="rounded-lg object-cover"
            data-ai-hint="study learning"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Cards Due Today</CardTitle>
            {overallDueCount > 0 ? <PlayCircle className="h-5 w-5 text-primary" /> : <CheckCircle2 className="h-5 w-5 text-green-500" />}
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{overallDueCount}</div>
            <p className="text-xs text-muted-foreground">
              {overallDueCount > 0 ? "Ready for your review session!" : "All caught up!"}
            </p>
          </CardContent>
          <CardFooter>
            {overallDueCount > 0 && decks.length > 0 && (
              <Link href={`/decks/${decks[0].id}/review`} passHref legacyBehavior> 
                 {/* Links to first deck's review if cards are due, better to link to a general review page if exists */}
                <Button className="w-full" size="sm">Start Review</Button>
              </Link>
            )}
             {overallDueCount === 0 && (
              <p className="text-sm text-muted-foreground w-full text-center">No reviews pending.</p>
            )}
            {decks.length === 0 && overallDueCount > 0 && (
              <p className="text-sm text-muted-foreground w-full text-center">Create a deck first.</p>
            )}
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Manage Decks</CardTitle>
            <LayoutGrid className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalDecks}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalCards} cards across all decks
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/decks" passHref legacyBehavior>
              <Button variant="outline" className="w-full" size="sm">View Decks</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Your Stats</CardTitle>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.masteryPercentage}%</div>
            <p className="text-xs text-muted-foreground">
              Overall card mastery
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/stats" passHref legacyBehavior>
              <Button variant="outline" className="w-full" size="sm">View Progress</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
      
      {decks.length > 0 && overallDueCount === 0 && (
        <Card className="bg-accent/20 border-accent">
            <CardHeader>
                <CardTitle className="text-accent-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-6 w-6 text-accent" />
                    You're All Caught Up!
                </CardTitle>
                <CardDescription className="text-accent-foreground/80">
                    All your scheduled reviews are complete. Great job!
                    Consider adding new cards or exploring your decks.
                </CardDescription>
            </CardHeader>
             <CardFooter className="flex gap-2">
                <Link href="/decks" passHref legacyBehavior><Button variant="outline">Manage Decks</Button></Link>
            </CardFooter>
        </Card>
      )}

      {decks.length === 0 && (
         <Card className="bg-primary/10 border-primary">
            <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                    <AlertCircle className="h-6 w-6 text-primary" />
                    Get Started with FlashWise
                </CardTitle>
                <CardDescription className="text-primary/80">
                    You don't have any decks yet. Create your first deck to begin your learning journey.
                    Organize your flashcards into subjects or topics for effective study.
                </CardDescription>
            </CardHeader>
            <CardFooter>
                <Link href="/decks" passHref legacyBehavior><Button>Create First Deck</Button></Link>
            </CardFooter>
        </Card>
      )}
    </div>
  );
}
