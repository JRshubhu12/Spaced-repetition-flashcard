"use client";

import { useFlashwiseStore } from '@/hooks/use-flashwise-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, CheckCircle, BookOpen, Clock } from 'lucide-react';

export function StatsOverview() {
  const { getOverallStats, isLoading } = useFlashwiseStore();
  const stats = getOverallStats();

  const statItems = [
    { title: 'Total Decks', value: stats.totalDecks, icon: BookOpen, color: "text-blue-500" },
    { title: 'Total Cards', value: stats.totalCards, icon: CheckCircle, color: "text-green-500" },
    { title: 'Cards Due Today', value: stats.dueTodayCount, icon: Clock, color: "text-orange-500" },
    { title: 'Overall Mastery', value: `${stats.masteryPercentage}%`, icon: TrendingUp, color: "text-purple-500" },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-1/3 mt-1" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => (
        <Card key={item.title} className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <item.icon className={`h-5 w-5 ${item.color ?? 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> // Example subtext */}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
