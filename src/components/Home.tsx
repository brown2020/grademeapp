"use client";

import Link from "next/link";
import {
  ArrowRight,
  FileCheck2,
  LayoutList,
  ScanSearch,
  SpellCheck2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/zustand/useAuthStore";
import { useAuthDialogStore } from "@/zustand/useAuthDialogStore";

const FEATURES = [
  {
    icon: FileCheck2,
    title: "Rubric-aligned grading",
    body: "Get a grade and line-of-reasoning feedback measured against the rubric you choose.",
  },
  {
    icon: LayoutList,
    title: "Rubrics that fit",
    body: "Start from a dozen proven rubric types or build your own for any assignment.",
  },
  {
    icon: SpellCheck2,
    title: "Grammar & spelling",
    body: "Clean up mechanics in one pass, then re-grade to see what changed.",
  },
  {
    icon: ScanSearch,
    title: "Originality check",
    body: "Scan for plagiarism and AI-generated passages before you submit.",
  },
];

const STEPS = [
  { title: "Add your draft", body: "Paste text or upload a DOCX, PDF, ODT, RTF or TXT file." },
  { title: "Pick a rubric", body: "Choose one suggested for your level, or make your own." },
  { title: "Improve it", body: "Read the feedback, revise, and grade again." },
];

/** Placeholder of a graded essay, drawn with tokens so it themes cleanly. */
function FeedbackPreview() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-accent/60 blur-2xl" aria-hidden />
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-raised">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Argumentative essay
            </div>
            <div className="font-serif text-lg font-semibold">The Case for Later School Start Times</div>
          </div>
          <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <span className="font-serif text-xl font-semibold leading-none">B+</span>
            <span className="mt-0.5 text-[0.625rem] font-medium">88%</span>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          {[
            ["Thesis & claims", 92],
            ["Evidence", 84],
            ["Organization", 90],
            ["Conventions", 81],
          ].map(([label, value]) => (
            <div key={label as string}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-muted-foreground">{label}</span>
                <span className="tabular-nums font-medium">{value}</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-lg border-l-2 border-primary bg-muted/60 p-3 font-serif text-sm leading-relaxed text-muted-foreground">
          Your thesis is clear and well-placed. Strengthen paragraph three by citing
          the sleep study directly rather than paraphrasing it.
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const uid = useAuthStore((s) => s.uid);
  const openAuth = useAuthDialogStore((s) => s.setOpen);

  const primaryCta = uid ? (
    <Button asChild size="lg">
      <Link href="/grader">
        Grade a draft <ArrowRight />
      </Link>
    </Button>
  ) : (
    <Button size="lg" onClick={() => openAuth(true)}>
      Get started free <ArrowRight />
    </Button>
  );

  return (
    <div className="flex flex-col">
      <section className="mx-auto grid w-full max-w-6xl items-center gap-12 overflow-x-clip px-4 pb-16 pt-10 sm:px-6 md:grid-cols-[1.1fr_1fr] md:pb-24 md:pt-20">
        <div className="flex flex-col items-start gap-6">
          <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
            AI feedback for students, educators & writers
          </span>
          <h1 className="font-serif text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
            Know your grade <span className="text-primary">before</span> you hand it in.
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            Grade.me reads your draft against a real rubric and tells you exactly
            what to fix — in seconds, not days.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {primaryCta}
            {!uid && (
              <Button variant="ghost" size="lg" asChild>
                <a href="#how-it-works">See how it works</a>
              </Button>
            )}
          </div>
        </div>
        <FeedbackPreview />
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-px px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex flex-col gap-3 p-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Icon className="size-5" />
              </div>
              <h2 className="font-semibold">{title}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 md:py-24">
        <h2 className="mb-10 font-serif text-3xl font-semibold tracking-tight">How it works</h2>
        <ol className="grid gap-8 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex flex-col gap-2 border-t border-border pt-5">
              <span className="font-serif text-sm font-semibold text-primary">0{i + 1}</span>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-14 flex flex-col items-start gap-4 rounded-2xl bg-foreground p-8 text-background sm:flex-row sm:items-center sm:justify-between md:p-10">
          <div>
            <h2 className="font-serif text-2xl font-semibold">Your next draft can be your best one.</h2>
            <p className="mt-1 opacity-70">The grade is a means to the feedback — not the end.</p>
          </div>
          {uid ? (
            <Button asChild size="lg" variant="secondary">
              <Link href="/grader">Open the grader</Link>
            </Button>
          ) : (
            <Button size="lg" variant="secondary" onClick={() => openAuth(true)}>
              Create a free account
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
