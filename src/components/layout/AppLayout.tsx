"use client";

import Link from "next/link";
import { Home, LayoutGrid, BarChart3, BookMarked, Settings } from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Header } from "./Header";
import { NavItem } from "./NavItem";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";


export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Determine if the sidebar should be shown based on the route
  // Example: hide on a dedicated full-screen review page if desired
  const showSidebar = !pathname.includes("/review-fullscreen"); // Customize this logic

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar
        collapsible={showSidebar ? "icon" : "none"} 
        className={showSidebar ? "" : "!hidden"} // Hide sidebar completely if not shown
        variant="sidebar"
      >
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
             <BookMarked className="h-7 w-7 text-primary flex-shrink-0" />
             <span className="font-semibold text-lg truncate group-data-[collapsible=icon]:hidden">FlashWise</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <NavItem href="/" icon={Home} label="Dashboard" />
            </SidebarMenuItem>
            <SidebarMenuItem>
              <NavItem href="/decks" icon={LayoutGrid} label="Decks" />
            </SidebarMenuItem>
            <SidebarMenuItem>
              <NavItem href="/stats" icon={BarChart3} label="Statistics" />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2">
           {/* Example Footer Item 
            <NavItem href="/settings" icon={Settings} label="Settings" />
           */}
        </SidebarFooter>
      </Sidebar>
      
      <SidebarInset className="flex flex-col">
        <Header>
          {showSidebar && <SidebarTrigger className="hidden md:flex" />}
        </Header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
