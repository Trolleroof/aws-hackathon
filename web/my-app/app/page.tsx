'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
} as const;

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } }
} as const;

const features = [
  {
    icon: '🔍',
    title: 'Problem discovery',
    description: 'Surface repeated, emotionally-charged problems worth solving.'
  },
  {
    icon: '👤',
    title: 'Target user',
    description: 'Define the persona, context, and pain points that matter.'
  },
  {
    icon: '🛠️',
    title: 'Tech stack',
    description: 'Get a buildable stack with clear reasoning for each layer.'
  },
  {
    icon: '⚡',
    title: 'Solution gaps',
    description: 'Understand why alternatives fail and where the opportunity is.'
  },
  {
    icon: '📋',
    title: 'Startup brief',
    description: 'A founder-ready one-pager with next validation steps.'
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0b0b0c] text-[#f5f5f5] selection:bg-white/10">
      <div className="mx-auto max-w-6xl px-6">
        <header className="sticky top-0 z-20 -mx-6 border-b border-white/5 bg-[#0b0b0c]/95 px-6 py-5 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <div className="text-sm font-semibold tracking-tight text-white">
              IdeaForge
            </div>
            <Link
              href="/app"
              className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 active:scale-[0.99]"
            >
              Launch
            </Link>
          </div>
        </header>

        <main className="py-12 sm:py-16">
          {/* Hero (centered) */}
          <section className="min-h-[calc(100vh-88px)] flex items-center justify-center">
            <motion.div
              className="mx-auto w-full max-w-3xl text-center"
              variants={fadeUp}
              initial="hidden"
              animate="show"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">
                AI idea validation
              </div>
              <h1 className="mt-5 text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-white">
                Brain dump your startup idea.
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-white/60">
                Five agents turn it into a crisp brief you can act on.
              </p>
              <div className="mt-10 flex items-center justify-center gap-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.99 }}>
                  <Link
                    href="/app"
                    className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black"
                  >
                    Start now <span className="ml-2">→</span>
                  </Link>
                </motion.div>
                <Link
                  href="/app"
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-transparent px-6 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/5 hover:text-white"
                >
                  Open app
                </Link>
              </div>
              <div className="mt-10 text-xs text-white/40">
                Record • Process • Explore
              </div>
            </motion.div>
          </section>

          {/* Features (minimal list) */}
          <section className="mx-auto max-w-4xl pb-16 sm:pb-20">
            <motion.div
              className="text-center"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.35 }}
            >
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">
                Features
              </div>
              <h2 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                Simple inputs. Structured outputs.
              </h2>
            </motion.div>

            <motion.div
              className="mt-10 divide-y divide-white/5 rounded-2xl border border-white/10"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
            >
              {features.map((f) => (
                <motion.div
                  key={f.title}
                  variants={fadeUp}
                  className="flex items-start gap-4 px-6 py-5"
                >
                  <div className="mt-0.5 text-xl">{f.icon}</div>
                  <div className="min-w-0 text-left">
                    <div className="text-sm font-semibold text-white">
                      {f.title}
                    </div>
                    <div className="mt-1 text-sm leading-relaxed text-white/60">
                      {f.description}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* How it works */}
          <section className="mx-auto max-w-4xl pb-16 sm:pb-24">
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
              <h2 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight text-white">
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
                { n: '01', title: 'Record', text: 'Capture the raw idea—fast and unfiltered.' },
                { n: '02', title: 'Process', text: 'Agents analyze and structure the output.' },
                { n: '03', title: 'Explore', text: 'Click nodes and iterate with clarity.' }
              ].map((step) => (
                <motion.div
                  key={step.n}
                  variants={fadeUp}
                  className="rounded-2xl border border-white/10 px-6 py-6"
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
          <div className="flex items-center justify-between text-sm text-white/50">
            <div className="text-white/80 font-semibold">IdeaForge</div>
            <div>Built with care</div>
          </div>
        </footer>
      </div>
    </div>
  );
}
