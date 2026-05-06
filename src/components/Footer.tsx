import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-12 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-white">
            Burnrate<span className="text-orange-500">.</span>
          </span>
        </div>
        <p className="text-sm text-zinc-500">
          Built for startups by{" "}
          <a
            href="https://credex.rocks"
            className="text-orange-500 hover:text-orange-400 font-medium transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Credex
          </a>
        </p>
        <div className="flex gap-4">
          <Link href="/" className="text-sm text-zinc-500 hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/audit" className="text-sm text-zinc-500 hover:text-white transition-colors">
            Start Audit
          </Link>
        </div>
      </div>
    </footer>
  );
}
