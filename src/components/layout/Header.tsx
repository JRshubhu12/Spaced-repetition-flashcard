"use client";

import Link from "next/link";
import { BookMarked, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSidebar } from "@/components/ui/sidebar";

interface HeaderProps {
  children?: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={toggleSidebar}
        aria-label="Toggle Menu"
      >
        <PanelLeft className="h-6 w-6" />
      </Button>
      
      <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
        <BookMarked className="h-6 w-6 text-primary" />
        <span className="font-bold text-xl">FlashWise</span>
      </Link>
      
      <div className="ml-auto flex items-center gap-4">
        {children}
      </div>
    </header>
  );
}
