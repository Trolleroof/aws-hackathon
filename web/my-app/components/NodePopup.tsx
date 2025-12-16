'use client';

import { useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AGENT_DESCRIPTIONS } from '@/data/agentNodes';
import type {
  AgentNode,
  ProblemDiscoveryContent,
  TargetUserContent,
  TechStackContent,
  SolutionGapContent,
  SynthesisContent,
} from '@/types/ideaGraph';

function Badge({ status }: { status: AgentNode['status'] }) {
  const cls =
    status === 'complete'
      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/15'
      : status === 'processing'
        ? 'bg-amber-500/15 text-amber-300 border-amber-500/15'
        : status === 'error'
          ? 'bg-red-500/15 text-red-300 border-red-500/15'
          : 'bg-white/5 text-white/60 border-white/10';

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${cls}`}>
      {status}
    </span>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <div className="shrink-0 text-xs font-semibold text-white/50 uppercase tracking-wide">{label}</div>
      <div className="min-w-0 text-sm text-white/80 text-right">{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">{title}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function renderContent(node: AgentNode) {
  if (!node.content) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/60">
        No output yet. Run Process to generate this agent’s results.
      </div>
    );
  }

  switch (node.type) {
    case 'problem': {
      const content = node.content as ProblemDiscoveryContent;
      return (
        <div className="space-y-3">
          <Section title="Confidence">
            <div className="text-sm text-white/80">{content.confidenceScore}/100</div>
          </Section>
          <Section title="Top Problems">
            <div className="space-y-3">
              {content.problems.map((p, idx) => (
                <div key={idx} className="rounded-lg border border-white/10 bg-black/30 p-3">
                  <div className="text-sm font-semibold text-white">{p.statement}</div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-white/60">
                    <div>Freq: {p.frequency}%</div>
                    <div>Eng: {p.engagement}</div>
                    <div>Emotion: {p.emotionalIntensity}/10</div>
                  </div>
                  <div className="mt-2 text-xs text-white/50">{p.sources.join(' • ')}</div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      );
    }
    case 'user': {
      const content = node.content as TargetUserContent;
      const u = content.primaryPersona;
      return (
        <div className="space-y-3">
          <Section title="Primary Persona">
            <div className="divide-y divide-white/10">
              <Field label="Title" value={u.title} />
              <Field label="Role" value={u.role} />
              <Field label="Seniority" value={u.seniority} />
              <Field label="Company" value={u.companySize} />
              <Field label="Industry" value={u.industry} />
            </div>
          </Section>
          <Section title="Pain Points">
            <div className="flex flex-wrap gap-2">
              {u.painPoints.map((pp) => (
                <span key={pp} className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-xs text-white/70">
                  {pp}
                </span>
              ))}
            </div>
          </Section>
          <Section title="Tools Used">
            <div className="flex flex-wrap gap-2">
              {u.toolsUsed.map((t) => (
                <span key={t} className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-xs text-white/70">
                  {t}
                </span>
              ))}
            </div>
          </Section>
        </div>
      );
    }
    case 'techstack': {
      const content = node.content as TechStackContent;
      return (
        <div className="space-y-3">
          <Section title="Architecture Notes">
            <div className="text-sm text-white/70 leading-relaxed">{content.architectureNotes}</div>
          </Section>
          <Section title="Recommended Stack">
            <div className="space-y-3">
              {content.components.map((c) => (
                <div key={c.category} className="rounded-lg border border-white/10 bg-black/30 p-3">
                  <div className="text-sm font-semibold text-white">{c.category}</div>
                  <div className="mt-2 text-sm text-white/70">{c.tools.join(', ')}</div>
                  <div className="mt-2 text-xs text-white/50">{c.rationale}</div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      );
    }
    case 'gaps': {
      const content = node.content as SolutionGapContent;
      return (
        <div className="space-y-3">
          <Section title="Summary">
            <div className="text-sm text-white/70 leading-relaxed">{content.summary}</div>
          </Section>
          <Section title="Gaps">
            <div className="space-y-3">
              {content.gaps.map((g, idx) => (
                <div key={idx} className="rounded-lg border border-white/10 bg-black/30 p-3">
                  <div className="text-sm font-semibold text-white">{g.existingSolution}</div>
                  <div className="mt-2 text-xs text-white/60">
                    <div>Friction: {g.frictionPoint}</div>
                    <div className="mt-1">Workaround: {g.workaround}</div>
                    <div className="mt-1">Opportunity: {g.opportunityZone}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      );
    }
    case 'synthesis': {
      const content = node.content as SynthesisContent;
      const b = content.brief;
      return (
        <div className="space-y-3">
          <Section title="Brief">
            <div className="divide-y divide-white/10">
              <Field label="Problem" value={b.problemStatement} />
              <Field label="Target user" value={b.targetUser} />
              <Field label="Need" value={b.coreUnmetNeed} />
              <Field label="Value prop" value={b.valueProposition} />
            </div>
          </Section>
          <Section title="MVP Features">
            <ul className="space-y-2 text-sm text-white/75">
              {b.mvpFeatures.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="mt-[2px] h-1.5 w-1.5 rounded-full bg-white/40" />
                  <span className="min-w-0">{f}</span>
                </li>
              ))}
            </ul>
          </Section>
          <Section title="Next Step">
            <div className="text-sm text-white/70 leading-relaxed">{b.nextValidationStep}</div>
          </Section>
        </div>
      );
    }
    default:
      return (
        <div className="rounded-xl border border-white/10 bg-black/30 p-4">
          <pre className="text-xs leading-relaxed text-white/75 whitespace-pre-wrap">
            {JSON.stringify(node.content, null, 2)}
          </pre>
        </div>
      );
  }
}

export function NodePopup({
  node,
  onClose,
}: {
  node: AgentNode | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!node) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [node, onClose]);

  const info = useMemo(() => (node ? AGENT_DESCRIPTIONS[node.type] : null), [node]);

  return (
    <AnimatePresence>
      {node && info && (
        <motion.div
          className="absolute inset-0 z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onPointerDown={onClose}
        >
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="absolute bottom-0 left-0 right-0 rounded-t-3xl border-t border-white/10 bg-[#0b0b0c]/95 shadow-[0_-30px_90px_rgba(0,0,0,0.65)] backdrop-blur sm:bottom-auto sm:left-auto sm:right-0 sm:top-0 sm:h-full sm:w-[520px] sm:rounded-none sm:border-l sm:border-t-0 sm:shadow-[-30px_0_90px_rgba(0,0,0,0.65)]"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/5 p-5">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-xl">
                    {info.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold tracking-tight text-white">
                      {info.title}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="truncate text-xs text-white/55">{node.name}</span>
                      <Badge status={node.status} />
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-sm leading-relaxed text-white/60">
                  {info.description}
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6 6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="max-h-[62vh] overflow-auto p-5 sm:max-h-none sm:h-[calc(100vh-86px)]">
              {renderContent(node)}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
