import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Shield, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-orange-500 opacity-20 blur-[100px]" />
      
      <section className="container mx-auto px-4 py-24 sm:py-32 flex flex-col items-center text-center relative z-10">
        <div className="inline-flex items-center rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-sm text-orange-400 mb-8">
          <Zap className="mr-2 h-4 w-4" />
          <span className="font-medium">100% Free AI Spend Audit</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-400">
          Stop burning money on <br className="hidden sm:block" />
          <span className="text-orange-500">AI infrastructure.</span>
        </h1>
        
        <p className="text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed">
          Most startups overspend on AI tools by 30-50%. 
          Find out exactly where you're wasting money on Cursor, ChatGPT, Claude, and more.
          Instant results. No signup required.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link href="/audit">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 h-14 text-lg rounded-full shadow-[0_0_40px_-10px_rgba(249,115,22,0.6)]">
              Start Free Audit
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl text-left border border-white/10 rounded-2xl bg-black/40 backdrop-blur-xl p-8">
          <div className="flex flex-col">
            <CheckCircle2 className="h-8 w-8 text-orange-500 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Identify Overspend</h3>
            <p className="text-sm text-zinc-400">We analyze your active seats and usage against our database of 20+ optimal pricing tiers.</p>
          </div>
          <div className="flex flex-col">
            <Zap className="h-8 w-8 text-orange-500 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Instant Alternatives</h3>
            <p className="text-sm text-zinc-400">Discover cheaper tools that map exactly to your team's use cases without losing capability.</p>
          </div>
          <div className="flex flex-col">
            <Shield className="h-8 w-8 text-orange-500 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Unbiased & Secure</h3>
            <p className="text-sm text-zinc-400">Hardcoded logic. No "hallucinated" savings. We don't ask for your email until after we show value.</p>
          </div>
        </div>
      </section>
      
      <section className="container mx-auto px-4 py-20 text-center relative z-10 border-t border-white/5">
        <p className="text-sm font-medium text-zinc-500 mb-8 uppercase tracking-widest">Supported Tools</p>
        <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <span className="text-2xl font-bold tracking-tighter">Cursor</span>
          <span className="text-2xl font-bold tracking-tighter">GitHub Copilot</span>
          <span className="text-2xl font-bold tracking-tighter">Claude</span>
          <span className="text-2xl font-bold tracking-tighter">ChatGPT</span>
          <span className="text-2xl font-bold tracking-tighter">Gemini</span>
          <span className="text-2xl font-bold tracking-tighter">Windsurf</span>
        </div>
      </section>
    </div>
  );
}
