"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

import { Separator } from "@/components/ui/separator"
import { ThemeSubMenu } from "@/components/theme-sub-menu";
import { ModeToggle } from "@/components/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { SearchBar } from "@/components/search-bar";

export default function Header() {
  const { data: session, status } = useSession()

  return (
    <div className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b">
      <header className="w-full px-3 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="text-lg sm:text-xl font-bold shrink-0 min-w-[80px]">
            Next Task
          </Link>

          {session?.user && <SearchBar />}

          <div className="flex items-center gap-3 shrink-0">
            <nav className="flex gap-3">
              {/* 1. Check if data is still loading */}
              {status === "loading" ? (
                <div className="h-8 w-24 rounded-full bg-muted animate-pulse" />
              ) : !session?.user ? (
                <>
                  <ModeToggle />
                  <Link href="/login"><Button variant="secondary">Login</Button></Link>
                  <Link href="/signup"><Button variant="default">Sign Up</Button></Link>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      id="user-menu-trigger"
                      suppressHydrationWarning
                      className="flex items-center gap-2 hover:bg-muted p-1 sm:pr-3 rounded-full transition-colors"
                    >
                      <div className="rounded-full overflow-hidden size-8 shrink-0">
                        {session.user.image ? (
                          <Image
                            src={session.user.image}
                            alt={session.user.name ?? "User avatar"}
                            width={32}
                            height={32}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-muted-foreground/10 rounded-full flex items-center justify-center text-sm uppercase">
                            {session.user.name?.[0] ?? "U"}
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium max-w-[150px] truncate hidden sm:inline-block">
                        {session.user.name}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent id="user-menu-content" align="end">
                    <div className="px-3 py-2">
                      <div className="text-sm font-medium">
                        {session.user.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {session.user.email}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <ThemeSubMenu />
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => signOut({ callbackUrl: "/" })}>
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </nav>
          </div>
        </div>
      </header>
    </div>
  );
}
