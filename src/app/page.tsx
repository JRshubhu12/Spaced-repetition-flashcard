
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useFlashwiseStore, usePersistedState } from '@/hooks/use-flashwise-store';
import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardDescription, CardFooter,
  CardHeader, CardTitle
} from '@/components/ui/card';
import {
  AlertCircle, CheckCircle2, LayoutGrid,
  PlayCircle, BarChart3, BellRing, BellOff, BellPlus
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect, useCallback } from 'react';
import { requestNotificationPermission, showSimpleNotification } from '@/lib/notificationUtils';

const NOTIFICATION_INTERVAL = 60 * 1000; // 1 minute for testing, adjust as needed (e.g., 5 * 60 * 1000 for 5 mins)
const DUE_CARDS_NOTIFICATION_TAG = 'due-cards-reminder';

export default function DashboardPage() {
  const { getDueCardsCount, getOverallStats, decks, cards, isLoading } = useFlashwiseStore();
  const overallDueCount = getDueCardsCount();
  const stats = getOverallStats();

  const [imagePreview, setImagePreview] = usePersistedState<string | null>('dashboardImagePreview', null);
  const [fileName, setFileName] = usePersistedState<string>('dashboardImageFileName', "");

  const [notificationStatus, setNotificationStatus] = useState<NotificationPermission | 'loading' | 'unsupported'>('loading');

  useEffect(() => {
    if (!('Notification' in window)) {
      setNotificationStatus('unsupported');
      return;
    }
    setNotificationStatus(Notification.permission);
  }, []);

  const handleRequestPermission = async () => {
    setNotificationStatus('loading');
    const permission = await requestNotificationPermission();
    setNotificationStatus(permission);
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (notificationStatus === 'granted' && !isLoading) {
      const checkAndNotify = () => {
        const dueCount = getDueCardsCount();
        if (dueCount > 0) {
          showSimpleNotification(
            'FlashWise Reminder',
            `You have ${dueCount} card${dueCount > 1 ? 's' : ''} due for review!`,
            DUE_CARDS_NOTIFICATION_TAG
          );
        }
      };

      // Initial check
      checkAndNotify();

      intervalId = setInterval(checkAndNotify, NOTIFICATION_INTERVAL);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [notificationStatus, isLoading, getDueCardsCount]);


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading && notificationStatus === 'loading') {
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
      <div className="mb-10 p-6 md:p-8 bg-gradient-to-br from-primary/15 via-primary/5 to-background rounded-xl shadow-lg ">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
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

          <div className="mt-6 md:mt-0 text-center w-full md:w-auto">
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-foreground">Upload Profile Picture</label>

              {!imagePreview && (
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="dashboard-image-upload"
                    className="flex flex-col items-center justify-center w-32 h-32 bg-card border-2 border-border border-dashed rounded-full cursor-pointer hover:bg-muted/50 transition"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        aria-hidden="true"
                        className="w-6 h-6 mb-2 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16V4m0 0L3 8m4-4l4 4M3 20h18"
                        />
                      </svg>
                      <p className="text-xs text-muted-foreground text-center px-2">
                        <span className="font-semibold">Upload</span>
                      </p>
                    </div>
                    <input
                      id="dashboard-image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              )}
            </div>

            <div className="mx-auto w-32 h-32 rounded-full overflow-hidden border border-border shadow-md">
              <Image
                src={imagePreview || "https://placehold.co/100x100.png"}
                alt={fileName || "Profile Image"}
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

        </div>

        {/* Notification Button Section */}
        {notificationStatus !== 'unsupported' && (
          <div className="mt-6 pt-4 border-t border-border/50">
            {notificationStatus === 'default' && (
              <Button onClick={handleRequestPermission} variant="outline">
                <BellPlus className="mr-2 h-4 w-4" /> Enable Notifications for Due Cards
              </Button>
            )}
            {notificationStatus === 'granted' && (
              <div className="flex items-center text-sm text-green-600">
                <BellRing className="mr-2 h-5 w-5" /> Notifications are enabled. You'll be reminded of due cards.
              </div>
            )}
            {notificationStatus === 'denied' && (
              <div className="flex items-center text-sm text-destructive">
                <BellOff className="mr-2 h-5 w-5" /> Notification permission denied. You can change this in your browser settings.
              </div>
            )}
            {notificationStatus === 'loading' && !isLoading && (
              <Button variant="outline" disabled>
                <BellPlus className="mr-2 h-4 w-4 animate-pulse" /> Checking permissions...
              </Button>
            )}
          </div>
        )}

      </div>

      {/* Dashboard Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
        <Card className="hover:shadow-xl transition-shadow duration-300 rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Cards Due Today</CardTitle>
            {overallDueCount > 0 ? (
              <PlayCircle className="h-5 w-5 text-primary" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            )}
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

        <Card className="hover:shadow-xl transition-shadow duration-300 rounded-lg">
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

        <Card className="hover:shadow-xl transition-shadow duration-300 rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Your Stats</CardTitle>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.masteryPercentage}%</div>
            <p className="text-xs text-muted-foreground">Overall card mastery</p>
          </CardContent>
          <CardFooter>
            <Link href="/stats" passHref legacyBehavior>
              <Button variant="outline" className="w-full" size="sm">View Progress</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Conditional Alerts */}
      {decks.length > 0 && overallDueCount === 0 && (
        <Card className="bg-accent/20 border-accent rounded-lg">
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
            <Link href="/decks" passHref legacyBehavior>
              <Button variant="outline">Manage Decks</Button>
            </Link>
          </CardFooter>
        </Card>
      )}

      {decks.length === 0 && (
        <Card className="bg-primary/10 border-primary rounded-lg">
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
            <Link href="/decks" passHref legacyBehavior>
              <Button>Create First Deck</Button>
            </Link>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

