
"use client";

import Link from "next/link";
import { Home, LayoutGrid, BarChart3, BookMarked, Settings, Linkedin, Github, UserCircle } from "lucide-react";
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
  SidebarMenuButton, // Added for direct use in footer
} from "@/components/ui/sidebar";
import { Header } from "./Header";
import { NavItem } from "./NavItem";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";


export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const showSidebar = !pathname.includes("/review-fullscreen"); 

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar
        collapsible={showSidebar ? "icon" : "none"} 
        className={showSidebar ? "" : "!hidden"}
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
        <SidebarFooter className="p-0"> {/* Adjusted padding */}
          {/* Expanded View for Developer Info */}
          <div className="group-data-[collapsible=icon]:hidden px-3 py-2">
            <Separator className="mb-2 mt-0 bg-sidebar-border" />
            <div className="text-xs font-medium text-sidebar-foreground/70 mb-1">Developed by</div>
            <div className="text-sm font-semibold text-sidebar-foreground mb-1.5">Shubham Choudhary</div>
            <div className="flex items-center space-x-3">
              <a
                href="https://www.linkedin.com/in/shubham-choudhary-6474b3234/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sidebar-foreground/80 hover:text-primary transition-colors"
                aria-label="Shubham Choudhary LinkedIn"
              >
                <Linkedin className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs">LinkedIn</span>
              </a>
              <a
                href="https://github.com/JRshubhu12"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sidebar-foreground/80 hover:text-primary transition-colors"
                aria-label="Shubham Choudhary GitHub"
              >
                <Github className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs">GitHub</span>
              </a>
            </div>
          </div>

          {/* Collapsed View for Developer Info */}
          <div className="hidden group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center px-1 py-2">
            <Separator className="mb-2 mt-0 bg-sidebar-border w-[calc(100%-0.5rem)]" />
            <SidebarMenuButton
              asChild
              tooltip={{
                side: "right",
                align: "center",
                children: (
                  <div>
                    <p className="font-medium">Shubham Choudhary</p>
                    <p className="text-xs text-muted-foreground">Software Developer</p>
                    <div className="text-xs mt-1">
                        <a href="https://www.linkedin.com/in/shubham-choudhary-6474b3234/" target="_blank" rel="noopener noreferrer" className="hover:underline text-primary">LinkedIn</a>
                        <span className="mx-1">|</span>
                        <a href="https://github.com/JRshubhu12" target="_blank" rel="noopener noreferrer" className="hover:underline text-primary">GitHub</a>
                    </div>
                  </div>
                ),
              }}
              className="justify-center !h-8 !w-8" // Ensure icon size consistency
            >
              <a href="https://github.com/JRshubhu12" target="_blank" rel="noopener noreferrer" aria-label="Developer GitHub">
                <UserCircle className="h-5 w-5" />
              </a>
            </SidebarMenuButton>
          </div>
           {/* Example Footer Item, kept for reference if needed
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
