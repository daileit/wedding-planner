"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  Home,
  FolderKanban,
  DollarSign,
  CalendarDays,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getTranslations } from "@/lib/i18n";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

function useNavItems(locale: string) {
  const t = getTranslations(locale as Parameters<typeof getTranslations>[0]);
  const items: NavItem[] = [
    { title: t.sidebar.dashboard, href: "/dashboard", icon: Home },
    { title: t.sidebar.myPlans, href: "/dashboard/plans", icon: FolderKanban },
    { title: t.sidebar.budget, href: "/dashboard/budget", icon: DollarSign },
    { title: t.sidebar.timeline, href: "/dashboard/timeline", icon: CalendarDays },
    { title: t.sidebar.vendors, href: "/dashboard/vendors", icon: Users },
    { title: t.sidebar.settings, href: "/dashboard/settings", icon: Settings },
  ];
  return items;
}

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const locale = typeof window !== "undefined" ? (document.documentElement.lang || "en") : "en";
  const navItems = useNavItems(locale);

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-primary">WedBeLoving</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/dashboard" className="mx-auto">
            <Heart className="h-6 w-6 text-primary" />
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("hidden lg:flex", collapsed && "mx-auto")}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span>{item.title}</span>
                  {item.badge !== undefined && (
                    <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      {!collapsed && (
        <div className="border-t p-4">
          <div className="rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 p-4">
            <p className="text-sm font-medium">Need help planning?</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try our AI assistant to generate your wedding plan automatically.
            </p>
            <Button size="sm" className="mt-3 w-full">
              Generate with AI
            </Button>
          </div>
        </div>
      )}
    </aside>
  );
}

// Mobile sidebar trigger
export function MobileSidebarTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute left-0 top-0 h-full w-64 bg-background"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar />
          </div>
        </div>
      )}
    </>
  );
}
