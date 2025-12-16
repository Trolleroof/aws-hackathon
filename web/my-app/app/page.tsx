"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070d] text-white">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.06),transparent_60%)]" />
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.25) 1.5px, transparent 0)",
          backgroundSize: "22px 22px",
          opacity: 0.75,
          maskImage: "radial-gradient(ellipse 60% 40% at 50% 20%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 40%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 40% at 50% 20%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 40%, transparent 70%)",
        }} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.45),rgba(0,0,0,0.1)_30%,rgba(0,0,0,0.5))]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center px-6 pb-14 pt-8">
        {/* Navigation */}
        <nav className="mt-1 w-[88%] rounded-2xl border border-white/10 bg-black/35 px-6 py-3 shadow-[0_12px_36px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:w-[78%] md:w-[72%]">
          <div className="flex items-center justify-between text-sm font-semibold tracking-tight">
            <div className="flex items-center gap-3 text-white">
              <span className="inline-flex h-10 items-center gap-2 rounded-xl bg-white/8 px-4 text-base font-semibold text-white">
                IdeaForge
              </span>
              <span className="hidden rounded-xl border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-200/70 sm:inline-flex">
                AI Idea Validation
              </span>
            </div>
            <Link
              href="/app"
              className="rounded-xl border border-white/14 bg-white/6 px-5 py-2 text-white transition hover:-translate-y-0.5 hover:border-emerald-200/80 hover:text-emerald-100"
            >
              Launch App
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="mt-16 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-slate-200/80">
            5 AI Agents Working For You
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-[56px]">
            Brain Dump Your Startup Idea
          </h1>
          <p className="mt-4 max-w-2xl text-lg font-medium text-slate-300">
            Speak your raw idea. Get back a validated concept with problem statements,
            target users, tech stack, competitive gaps, and a founder-ready brief.
          </p>
          <div className="relative mt-8 flex items-center gap-4">
            <Link
              href="/app"
              className="relative inline-flex items-center justify-center rounded-xl bg-emerald-400 px-8 py-3.5 text-base font-semibold text-emerald-950 shadow-[0_14px_45px_rgba(16,185,129,0.35)] transition hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-emerald-300/60"
            >
              Start Brain Dumping
            </Link>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            From raw thought to validated concept in under 5 minutes
          </p>
        </section>

        {/* 5 Agents Section */}
        <section className="relative mt-20 w-full max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              5 AI Agents, One Mission
            </h2>
            <p className="mt-3 text-lg text-slate-300">
              Each agent tackles a crucial part of idea validation
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Problem Discovery */}
            <div className="group relative overflow-hidden rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 backdrop-blur-xl transition hover:bg-amber-500/10">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 text-2xl">
                🔍
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Problem Discovery</h3>
              <p className="text-sm text-slate-300">
                Searches Reddit, HN, Twitter, and forums. Finds real, repeated, emotionally charged problems worth solving.
              </p>
              <div className="mt-4 text-xs text-amber-400/80">
                Output: Top 3-5 validated problem statements
              </div>
            </div>

            {/* Target User */}
            <div className="group relative overflow-hidden rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 backdrop-blur-xl transition hover:bg-blue-500/10">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-2xl">
                👤
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Target User ID</h3>
              <p className="text-sm text-slate-300">
                Defines who experiences the problem. Role, seniority, company size, industry, tools used.
              </p>
              <div className="mt-4 text-xs text-blue-400/80">
                Output: LinkedIn-ready persona definition
              </div>
            </div>

            {/* Tech Stack */}
            <div className="group relative overflow-hidden rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6 backdrop-blur-xl transition hover:bg-violet-500/10">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/20 text-2xl">
                🛠️
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Tech Stack</h3>
              <p className="text-sm text-slate-300">
                Recommends practical, buildable tech: LLM, data ingestion, search, orchestration, and output layers.
              </p>
              <div className="mt-4 text-xs text-violet-400/80">
                Output: Modular, demo-ready architecture
              </div>
            </div>

            {/* Solution Gaps */}
            <div className="group relative overflow-hidden rounded-2xl border border-red-500/20 bg-red-500/5 p-6 backdrop-blur-xl transition hover:bg-red-500/10">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20 text-2xl">
                ⚡
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Solution Gaps</h3>
              <p className="text-sm text-slate-300">
                Analyzes why existing solutions fail. Finds opportunity zones where your product can win.
              </p>
              <div className="mt-4 text-xs text-red-400/80">
                Output: Competitive gap analysis
              </div>
            </div>

            {/* Synthesis */}
            <div className="group relative overflow-hidden rounded-2xl border border-pink-500/20 bg-pink-500/5 p-6 backdrop-blur-xl transition hover:bg-pink-500/10 md:col-span-2 lg:col-span-1">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/20 text-2xl">
                📋
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Startup Brief</h3>
              <p className="text-sm text-slate-300">
                Synthesizes everything into a founder-ready brief: value prop, MVP features, next validation step.
              </p>
              <div className="mt-4 text-xs text-pink-400/80">
                Output: Build, pitch, or validate immediately
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="relative mt-20 w-full max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-3 text-lg text-slate-300">
              Three steps from idea to validation
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-xl font-bold text-white">
                1
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Brain Dump</h3>
              <p className="text-sm text-slate-300">
                Click the mic and speak your startup idea freely. No structure needed - just dump everything in your head.
              </p>
            </div>

            <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-xl font-bold text-white">
                2
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">AI Processing</h3>
              <p className="text-sm text-slate-300">
                5 specialized agents analyze your idea in parallel. Watch the graph nodes light up as each completes.
              </p>
            </div>

            <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-500 text-xl font-bold text-white">
                3
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Explore Results</h3>
              <p className="text-sm text-slate-300">
                Click any node to see detailed analysis. Your raw idea is now a validated, actionable startup concept.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative mt-20 mb-16 w-full max-w-5xl">
          <div className="overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 p-8 text-center backdrop-blur-xl md:p-12">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Validate Your Idea?
            </h2>
            <p className="mt-4 text-lg text-slate-300">
              Stop guessing. Let AI do the research for you.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/app"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-400 px-8 py-3.5 text-base font-semibold text-emerald-950 shadow-[0_14px_45px_rgba(16,185,129,0.35)] transition hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-emerald-300/60"
              >
                Start Brain Dumping
              </Link>
            </div>
            <p className="mt-6 text-sm text-slate-400">
              No signup required • Free to use • Results in minutes
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-auto w-full border-t border-white/5 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-500 sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">IdeaForge</span>
              <span>• AI-Powered Idea Validation</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Built with Nova AI (coming soon)</span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
