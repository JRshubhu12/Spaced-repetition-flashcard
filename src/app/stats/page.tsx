"use client";

import { StatsOverview } from '@/components/stats/StatsOverview';
import { MasteryChart } from '@/components/stats/MasteryChart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useFlashwiseStore } from '@/hooks/use-flashwise-store';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function StatsPage() {
  const { decks, cards, isLoading } = useFlashwiseStore();

  const hasData = !isLoading && (decks.length > 0 || cards.length > 0);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Your Progress</h1>
        <p className="text-muted-foreground">Track your learning journey and see how you're improving.</p>
      </div>
      
      <StatsOverview />

      {hasData ? (
        <div className="grid gap-8 lg:grid-cols-1"> {/* Changed to 1 col for better chart display */}
          <MasteryChart />
          {/* Add more charts or stats components here */}
          {/* 
          <Card>
            <CardHeader>
              <CardTitle>Activity Heatmap</CardTitle>
              <CardDescription>Placeholder for daily review activity.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">Heatmap coming soon!</p>
            </CardContent>
          </Card>
           */}
        </div>
      ) : (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>No Data Yet</CardTitle>
            <CardDescription>Start creating decks and reviewing cards to see your statistics here.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">Looks like you're just getting started!</p>
            <Link href="/decks" passHref legacyBehavior>
              <Button>Create Your First Deck</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
