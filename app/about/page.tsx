import Link from "next/link";
import { Button } from "@/components/ui/button"
// import { Button, type ButtonProps } from '@/components/animate-ui/components/buttons/button';

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-3xl font-bold mb-4">About Page</h1>
      <p className="mb-6">Це додаткова сторінка для прикладу.</p>
      <Link href="/">
        <Button>На головну</Button>
      </Link>
    </main>
  );
}
