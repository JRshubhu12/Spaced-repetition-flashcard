"use client";

import { useFlashwiseStore } from '@/hooks/use-flashwise-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = ['hsl(var(--accent))', 'hsl(var(--primary))', 'hsl(var(--muted))']; // Green, Blue, Gray

export function MasteryChart() {
  const { cards, isLoading } = useFlashwiseStore();

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  if (cards.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Card Mastery Distribution</CardTitle>
          <CardDescription>No cards available to show mastery data.</CardDescription>
        </CardHeader>
        <CardContent className="h-[250px] flex items-center justify-center">
          <p className="text-muted-foreground">Add cards to see your mastery progress.</p>
        </CardContent>
      </Card>
    );
  }

  const masteryData = [
    { name: 'Mastered (Interval > 21d)', value: cards.filter(c => c.interval > 21).length },
    { name: 'Learning (Interval 1-21d)', value: cards.filter(c => c.interval > 0 && c.interval <= 21).length },
    { name: 'New/Relearning (Interval 0d)', value: cards.filter(c => c.interval === 0).length },
  ].filter(item => item.value > 0); // Filter out categories with 0 cards

  if (masteryData.length === 0 && cards.length > 0) {
     // This case might happen if all cards are in a state not covered or if logic is off.
     // For now, show a message if all cards fall into a state that results in empty masteryData.
     return (
      <Card>
        <CardHeader>
          <CardTitle>Card Mastery Distribution</CardTitle>
          <CardDescription>Could not determine mastery distribution for current cards.</CardDescription>
        </CardHeader>
        <CardContent className="h-[250px] flex items-center justify-center">
          <p className="text-muted-foreground">Review cards to update mastery data.</p>
        </CardContent>
      </Card>
    );
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Mastery Distribution</CardTitle>
        <CardDescription>Visual breakdown of your flashcard mastery levels.</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] pb-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={masteryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {masteryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => `${value} cards`}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
