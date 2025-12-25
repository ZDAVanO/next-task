import Link from "next/link";
import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "@/components/mode-toggle";

export default function Header() {
  return (
    <>
      <header className="w-full px-3 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Next Task
          </Link>
          <div className="flex items-center gap-3">
            <nav className="flex gap-3">
              <Link href="/login">
                <Button variant="secondary">Login</Button>
              </Link>
              <Link href="/signup">
                <Button variant="default">Sign Up</Button>
              </Link>
            </nav>
            <ModeToggle />
          </div>
        </div>
      </header>
      <Separator className="" />
    </>
  );
}
