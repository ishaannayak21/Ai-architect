import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Database,
  FileCode2,
  FolderTree,
  Layers,
  LineChart,
  Network,
  Rocket,
  Sparkles,
  Workflow,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-32 sm:pt-40">
      {/* Retro grid background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[28rem] w-[52rem] -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-grid opacity-70 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="mx-auto max-w-3xl px-4 text-center sm:px-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Badge variant="brand" className="px-3.5 py-1 text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="size-3.5" />
            [ AI SOFTWARE ARCHITECT ENGINE ]
          </Badge>
        </motion.div>

        <h1 className="mt-6 text-balance font-serif text-4xl font-bold leading-[1.15] tracking-tight text-[#1F2421] dark:text-[#E6ECE7] sm:text-6xl">
          Turn a single sentence into a{" "}
          <span className="text-[#C05621] underline decoration-[#C05621]/30 underline-offset-8 dark:text-[#E07A48]">
            complete software blueprint
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-pretty font-sans text-lg text-[#4A524C] dark:text-[#A3B5A7]">
          Describe your idea — "Build an E-commerce Platform." Our engine drafts
          requirements, database design, API endpoints, architecture, diagrams,
          deployment plans and more in seconds.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
          <Link to={ROUTES.REGISTER}>
            <Button size="lg">
              Start building free
              <ArrowRight className="size-4.5" />
            </Button>
          </Link>
          <Link to={ROUTES.LOGIN}>
            <Button size="lg" variant="secondary">
              Sign in to workspace
            </Button>
          </Link>
        </div>

        <p className="mt-5 font-mono text-xs text-stone-500">
          Free to start · Instant Blueprint Generation · Security Ready
        </p>
      </motion.div>

      {/* Mock output card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.6 }}
        className="mx-auto mt-16 max-w-2xl px-4 sm:px-6"
      >
        <div className="retro-card rounded-2xl p-5 shadow-xl">
          <div className="flex items-center gap-3 border-b border-stone-200/80 pb-3.5 dark:border-stone-800/80">
            <span className="flex size-9 items-center justify-center rounded-xl bg-amber-500 text-stone-950 font-bold shadow-2xs">
              <Rocket className="size-4.5" />
            </span>
            <div>
              <p className="font-display font-bold text-stone-900 dark:text-stone-100">E-commerce Platform</p>
              <p className="font-mono text-xs text-stone-500">
                [ ARCHITECTURE SPECIFICATION PREVIEW ]
              </p>
            </div>
            <div className="ml-auto flex gap-1.5">
              <span className="size-2.5 rounded-full bg-stone-300 dark:bg-stone-700" />
              <span className="size-2.5 rounded-full bg-stone-300 dark:bg-stone-700" />
              <span className="size-2.5 rounded-full bg-amber-500" />
            </div>
          </div>
          <div className="mt-4 space-y-2.5">
            {[
              { icon: Database, label: "Database Schema", value: "12 tables · PostgreSQL · Indexes" },
              { icon: FileCode2, label: "REST API Contracts", value: "28 endpoints · Open API Spec" },
              { icon: FolderTree, label: "Directory Layout", value: "Clean Layered Architecture" },
              { icon: LineChart, label: "Cost & Scale Model", value: "~$1.4k / mo estimated scale" },
            ].map(({ icon: Icon, label, value }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.12 }}
                className="flex items-center gap-3 rounded-xl border border-stone-200/60 bg-stone-100/60 px-3.5 py-2.5 dark:border-stone-800/60 dark:bg-stone-800/40"
              >
                <Icon className="size-4 text-amber-600 dark:text-amber-400" />
                <span className="font-display text-xs font-semibold text-stone-800 dark:text-stone-200">
                  {label}
                </span>
                <span className="ml-auto font-mono text-xs text-stone-500 dark:text-stone-400">
                  {value}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

const features = [
  {
    icon: Sparkles,
    title: "Requirements",
    description: "Structured, prioritized functional specifications derived from your prompt.",
  },
  {
    icon: Database,
    title: "Database Design",
    description: "Normalized SQL/NoSQL schema with tables, relationships and indexes.",
  },
  {
    icon: Workflow,
    title: "API Endpoints",
    description: "REST & GraphQL endpoint specs with methods, payloads and status codes.",
  },
  {
    icon: FolderTree,
    title: "Folder Structure",
    description: "Production-grade repository layout tailored to your tech stack.",
  },
  {
    icon: Network,
    title: "System Architecture",
    description: "Component hierarchy, microservice boundaries and data flow.",
  },
  {
    icon: Layers,
    title: "Mermaid Diagrams",
    description: "Auto-generated Mermaid sequence, ERD, and architecture diagrams.",
  },
  {
    icon: LineChart,
    title: "Cost & Scaling",
    description: "Infrastructure tier forecasts and cloud cost estimation by scale.",
  },
  {
    icon: Rocket,
    title: "Deployment Plan",
    description: "CI/CD pipelines, containerization, DNS setup and rollout strategy.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div {...fadeUp} className="mx-auto max-w-xl text-center">
          <Badge variant="brand">FEATURES MATRIX</Badge>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100 sm:text-4xl">
            Everything your software idea needs to ship
          </h2>
          <p className="mt-3 text-pretty text-stone-600 dark:text-stone-400">
            Stop hand-writing architectural documents. Generate a complete engineering blueprint in under 60 seconds.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: (index % 4) * 0.08 }}
            >
              <div className="retro-card group h-full rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/40">
                <div className="flex size-10 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-700 transition-colors group-hover:bg-amber-500 group-hover:text-stone-950 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-4 font-display font-bold text-stone-900 dark:text-stone-100">{title}</h3>
                <p className="mt-1.5 text-sm text-stone-600 dark:text-stone-400">
                  {description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const stats = [
  { value: "10+", label: "Engineering deliverables per blueprint" },
  { value: "<60s", label: "Average generation runtime" },
  { value: "5+", label: "Mermaid diagram types" },
  { value: "100%", label: "Exportable & production ready" },
];

export function Stats() {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div {...fadeUp}>
          <div className="relative overflow-hidden rounded-3xl border border-stone-800 bg-stone-950 p-8 text-stone-100 shadow-xl sm:p-12">
            <div className="absolute inset-0 bg-grid opacity-30" />
            <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-amber-500/15 blur-3xl" />
            <div className="relative grid grid-cols-2 gap-8 lg:grid-cols-4">
              {stats.map(({ value, label }) => (
                <div key={label}>
                  <p className="font-display text-4xl font-bold tracking-tight text-amber-400 sm:text-5xl">
                    {value}
                  </p>
                  <p className="mt-2 font-mono text-xs uppercase tracking-wider text-stone-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const steps = [
  {
    step: "01",
    title: "Describe your idea",
    description:
      "Write a sentence or paragraph explaining your web or mobile app concept, target users, and main goals.",
  },
  {
    step: "02",
    title: "Architect engine designs blueprint",
    description:
      "Our AI architect constructs database models, REST contracts, system architecture, and Mermaid diagrams.",
  },
  {
    step: "03",
    title: "Review, refine & export",
    description:
      "Interact with the AI Architect Chat to refine specs, view technical documentation, or export to Markdown.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div {...fadeUp} className="mx-auto max-w-xl text-center">
          <Badge variant="brand">WORKFLOW</Badge>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100 sm:text-4xl">
            From idea to architecture in 3 steps
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {steps.map(({ step, title, description }, index) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: index * 0.12 }}
            >
              <div className="retro-card relative h-full rounded-2xl p-6">
                <span className="font-display text-4xl font-bold text-amber-600 dark:text-amber-400">
                  {step}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-stone-900 dark:text-stone-100">{title}</h3>
                <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
                  {description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const faqs: Array<{ question: string; answer: string }> = [
  {
    question: "What exactly will the AI Architect generate?",
    answer:
      "Requirements, database schema, API contracts, folder structure, system architecture, Mermaid diagrams, deployment plan, development timeline, cost estimation, and technical documentation.",
  },
  {
    question: "Can I refine or customize the generated blueprint?",
    answer:
      "Yes! Every blueprint comes with an integrated AI Architect Chat window allowing you to ask questions, request modifications, or clarify architectural decisions.",
  },
  {
    question: "Is my data and project idea secure?",
    answer:
      "Passwords are salted & hashed with bcrypt and authentication uses signed JWTs. Your projects remain private to your user workspace.",
  },
  {
    question: "Can I export the architecture diagrams and docs?",
    answer:
      "Yes. Every generated deliverable and Mermaid diagram can be exported or copied as clean Markdown code for Notion, GitHub, or internal documentation.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <motion.div {...fadeUp} className="text-center">
          <Badge variant="brand">FAQ</Badge>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100 sm:text-4xl">
            Frequently asked questions
          </h2>
        </motion.div>

        <div className="mt-10 space-y-3">
          {faqs.map(({ question, answer }, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={question}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.3, delay: index * 0.06 }}
                className="retro-card overflow-hidden rounded-2xl"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-display font-semibold text-stone-900 dark:text-stone-100"
                >
                  <span>{question}</span>
                  <ChevronDown
                    className={`size-4.5 shrink-0 text-stone-400 transition-transform duration-300 dark:text-stone-500 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="px-5 pb-4 text-sm text-stone-600 dark:text-stone-400">
                    {answer}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function CtaSection() {
  return (
    <section className="pb-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div {...fadeUp}>
          <div className="relative overflow-hidden rounded-3xl border border-stone-800 bg-stone-950 p-10 text-center text-stone-100 shadow-xl sm:p-16">
            <div className="absolute inset-0 bg-grid opacity-30" />
            <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-amber-500/15 blur-3xl" />
            <h2 className="relative mx-auto max-w-lg font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Your next software architecture starts with one sentence
            </h2>
            <p className="relative mx-auto mt-3 max-w-md text-stone-400">
              Join today and generate your first blueprint — free.
            </p>
            <div className="relative mt-8 flex justify-center">
              <Link to={ROUTES.REGISTER}>
                <Button size="lg">
                  Create your free account
                  <ArrowRight className="size-4.5" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}