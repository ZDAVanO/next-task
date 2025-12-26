"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "@/components/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { data: session, status } = useSession()

  return (
    <>
      <header className="w-full px-3 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Next Task
          </Link>
          <div className="flex items-center gap-3">
            <nav className="flex gap-3">
              {/* 1. Check if data is still loading */}
              {status === "loading" ? (
                <div className="size-8 rounded-full bg-muted animate-pulse" /> // Just a gray pulsing blob
              ) : !session?.user ? (
                <>
                  <Link href="/login"><Button variant="secondary">Login</Button></Link>
                  <Link href="/signup"><Button variant="default">Sign Up</Button></Link>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="rounded-full overflow-hidden size-8">
                      {session.user.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name ?? "User avatar"}
                          width={32}
                          height={32}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-muted-foreground/10 rounded-full flex items-center justify-center text-sm">
                          {session.user.name?.[0] ?? "U"}
                        </div>
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <div className="px-3 py-2">
                      <div className="text-sm font-medium">
                        {session.user.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {session.user.email}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => signOut({ callbackUrl: "/" })}>
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </nav>
            <ModeToggle />
          </div>
        </div>
      </header>
      <Separator className="" />
    </>
  );
}
