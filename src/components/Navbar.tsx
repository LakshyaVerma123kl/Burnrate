import Link from "next/link";
import { Flame } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Flame className="h-6 w-6 text-orange-500" />
          <span className="text-xl font-bold tracking-tight text-white">
            Burnrate<span className="text-orange-500">.</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <a
            href="https://credex.rocks"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            By Credex
          </a>
        </div>
      </div>
    </nav>
  );
}
