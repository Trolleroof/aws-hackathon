'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
} as const;

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
} as const;

const outputs = [
  {
    title: 'Problem discovery',
    description: 'Surface repeated, emotionally-charged problems worth solving.',
  },
  {
    title: 'Target user',
    description: 'Define the persona, context, and pain points that matter.',
  },
  {
    title: 'Tech stack',
    description: 'Get a buildable stack with clear reasoning for each layer.',
  },
  {
    title: 'Solution gaps',
    description: 'Understand why alternatives fail and where the opportunity is.',
  },
  {
    title: 'Startup brief',
    description: 'A founder-ready one-pager with next validation steps.',
  },
];

const ideaExamples = [
  '“A calendar that schedules around deep work automatically.”',
  '“Duolingo, but for personal finance habits.”',
  '“Notion templates that adapt to your role weekly.”',
  '“AI interview practice for non-native speakers.”',
] as const;

export default function HomePage() {
  const [exampleIndex, setExampleIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setExampleIndex((i) => (i + 1) % ideaExamples.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#05070d] text-[#f5f5f5] selection:bg-white/15">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-56 left-1/2 h-[680px] w-[860px] -translate-x-1/2 rounded-full bg-gradient-to-b from-emerald-400/16 via-sky-500/8 to-transparent blur-3xl" />
        <div className="absolute -bottom-64 right-[-240px] h-[620px] w-[620px] rounded-full bg-gradient-to-tr from-indigo-500/14 via-fuchsia-500/10 to-transparent blur-3xl" />
        <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] [background-size:28px_28px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <header className="sticky top-0 z-20 -mx-6 border-b border-white/5 bg-[#05070d]/85 px-6 py-5 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm font-semibold">
                IF
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold tracking-tight text-white">
                  IdeaForge
                </div>
                <div className="text-[11px] font-medium text-white/50">
                  Voice → agents → brief
                </div>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.99 }}>
              <Link
                href="/app"
                className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white"
              >
                Open app
              </Link>
            </motion.div>
          </div>
        </header>

        <main className="py-12 sm:py-16">
          {/* Hero */}
          <section className="min-h-[calc(100dvh-88px)] flex items-center">
            <motion.div
              className="relative grid w-full -translate-y-6 grid-cols-1 items-center gap-10 lg:-translate-y-10 lg:grid-cols-[1.1fr_0.9fr]"
              variants={stagger}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={fadeUp} className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-gradient-to-b from-white/10 to-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
                  AI idea validation
                  <span className="h-1 w-1 rounded-full bg-white/30" />
                  fast, structured, actionable
                </div>

                <h1 className="mt-6 text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl text-balance">
                  Brain dump your startup idea—get a brief you can build from.
                </h1>

                <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/60 sm:text-xl">
                  Speak your raw thought. Five agents extract the problem, user, stack, gaps, and next steps.
                </p>

                <motion.div
                  variants={fadeUp}
                  className="mt-6 flex items-center justify-center gap-3 text-sm text-white/50 lg:justify-start"
                >
                  <span className="text-white/35">Try:</span>
                  <div className="min-h-[1.5rem]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={ideaExamples[exampleIndex]}
                        initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        className="text-white/60"
                      >
                        {ideaExamples[exampleIndex]}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
                >
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.99 }}>
                    <Link
                      href="/app"
                      className="inline-flex w-full items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black sm:w-auto"
                    >
                      Start now <span className="ml-2">→</span>
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.99 }}>
                    <Link
                      href="/app"
                      className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-transparent px-6 py-3 text-sm font-semibold text-white/80 sm:w-auto"
                    >
                      See the workspace
                    </Link>
                  </motion.div>
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-white/45 lg:justify-start"
                >
                  <span>Voice-first input</span>
                  <span className="hidden sm:inline text-white/20">•</span>
                  <span>Graph exploration</span>
                  <span className="hidden sm:inline text-white/20">•</span>
                  <span>Founder-ready output</span>
                </motion.div>
              </motion.div>

              <motion.div variants={fadeUp} className="mx-auto w-full max-w-lg lg:max-w-none">
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.55)] backdrop-blur"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">
                      Output preview
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-end gap-1">
                        {[0, 0.12, 0.24].map((delay) => (
                          <motion.div
                            key={delay}
                            className="h-3 w-1 rounded-full bg-emerald-300/40"
                            initial={{ scaleY: 0.45 }}
                            animate={{ scaleY: [0.45, 1, 0.55] }}
                            transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut', delay }}
                            style={{ transformOrigin: 'bottom' }}
                          />
                        ))}
                      </div>
                      <div className="text-[11px] font-mono uppercase tracking-[0.28em] text-white/35">
                        5 agents
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {outputs.slice(0, 4).map((item, index) => (
                      <div
                        key={item.title}
                        className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                      >
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[11px] font-semibold text-white/70">
                          {index + 1}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-white">
                            {item.title}
                          </div>
                          <div className="mt-1 text-sm leading-relaxed text-white/55">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 rounded-2xl border border-white/10 bg-gradient-to-r from-white/5 via-white/4 to-white/5 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-white">Startup brief</div>
                      <div className="rounded-full bg-emerald-400/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
                        ready
                      </div>
                    </div>
                    <div className="mt-1 text-sm leading-relaxed text-white/55">
                      A clean one-pager: risks, assumptions to test, and the simplest next experiment.
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </section>

          {/* Outputs */}
          <section className="mx-auto max-w-5xl pb-16 sm:pb-20">
            <motion.div
              className="text-center"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.35 }}
            >
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">
                What you get
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl text-balance">
                Minimal input. Maximum clarity.
              </h2>
            </motion.div>

            <motion.div
              className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
            >
              {outputs.map((item) => (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  className="rounded-2xl border border-white/10 bg-white/5 px-6 py-6 backdrop-blur"
                >
                  <div className="text-sm font-semibold text-white">
                    {item.title}
                  </div>
                  <div className="mt-2 text-sm leading-relaxed text-white/60">
                    {item.description}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* How it works */}
          <section className="mx-auto max-w-5xl pb-16 sm:pb-24">
            <motion.div
              className="text-center"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.35 }}
            >
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">
                How it works
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Record → Process → Explore
              </h2>
            </motion.div>

            <motion.div
              className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
            >
              {[
                {
                  n: '01',
                  title: 'Record',
                  text: 'Capture the raw idea—fast, messy, honest.',
                },
                {
                  n: '02',
                  title: 'Process',
                  text: 'Parallel agents structure the thinking and surface gaps.',
                },
                {
                  n: '03',
                  title: 'Explore',
                  text: 'Click nodes, read outputs, and iterate with clarity.',
                },
              ].map((step) => (
                <motion.div
                  key={step.n}
                  variants={fadeUp}
                  className="rounded-2xl border border-white/10 bg-white/5 px-6 py-6 backdrop-blur"
                >
                  <div className="text-xs font-semibold tracking-wide text-white/50">
                    {step.n}
                  </div>
                  <div className="mt-3 text-sm font-semibold text-white">
                    {step.title}
                  </div>
                  <div className="mt-2 text-sm leading-relaxed text-white/60">
                    {step.text}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>
        </main>

        <footer className="border-t border-white/5 py-10">
          <div className="flex flex-col items-center justify-between gap-3 text-sm text-white/50 sm:flex-row">
            <div className="text-white/80 font-semibold">IdeaForge</div>
            <div className="text-white/45">
              Built for fast, honest validation.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
