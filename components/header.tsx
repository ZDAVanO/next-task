import Link from "next/link";
import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "@/components/mode-toggle";

export default function Header() {
  return (
    <>
    <header className="w-full flex items-center justify-between px-6 py-4">
        
      <div className="text-xl font-bold">Next Task</div>

      <div className="flex items-center gap-4">

        <nav className="flex gap-4">
          <Link href="/login">
            <Button variant="secondary">Login</Button>
          </Link>
          <Link href="/signup">
            <Button variant="default">Sign Up</Button>
          </Link>
        </nav>

        <ModeToggle />
      </div>

    </header>

    <Separator className="" />
    </>
  );
}
