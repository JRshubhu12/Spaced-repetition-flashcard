"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SidebarMenuButton } from '@/components/ui/sidebar'; // Assuming SidebarMenuButton is for this purpose
import type { VariantProps } from 'class-variance-authority';

interface NavItemProps extends VariantProps<typeof SidebarMenuButton> {
  href: string;
  icon: LucideIcon;
  label: string;
  className?: string;
  tooltipContent?: string | React.ReactNode;
}

export function NavItem({ href, icon: Icon, label, className, tooltipContent, ...props }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <SidebarMenuButton
      asChild
      isActive={isActive}
      tooltip={tooltipContent || label}
      className={cn("justify-start", className)}
      {...props}
    >
      <Link href={href}>
        <Icon className="h-5 w-5" />
        <span className="truncate">{label}</span>
      </Link>
    </SidebarMenuButton>
  );
}
