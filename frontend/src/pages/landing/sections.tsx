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
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[28rem] w-[52rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-400/30 via-violet-400/30 to-brand-500/30 blur-3xl" />
        <div className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
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
          <Badge variant="brand" className="px-3 py-1 text-sm">
            <Sparkles className="size-3.5" />
            AI Software Architect
          </Badge>
        </motion.div>

        <h1 className="mt-6 text-balance text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
          Turn a single sentence into a{" "}
          <span className="bg-gradient-to-r from-brand-500 to-violet-500 bg-clip-text text-transparent">
            complete software blueprint
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-pretty text-lg text-ink/60 dark:text-white/55">
          Describe your idea — "Build an E-commerce Platform." Our engine drafts
          requirements, database design, API endpoints, architecture, diagrams,
          deployment plans and more in seconds.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to={ROUTES.REGISTER}>
            <Button size="lg">
              Start building free
              <ArrowRight className="size-4.5" />
            </Button>
          </Link>
          <Link to={ROUTES.LOGIN}>
            <Button size="lg" variant="secondary">
              Sign in
            </Button>
          </Link>
        </div>

        <p className="mt-5 text-xs text-ink/40 dark:text-white/40">
          Free to start · No credit card required · Milestone 1 preview
        </p>
      </motion.div>

      {/* Mock output card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.6 }}
        className="mx-auto mt-16 max-w-2xl px-4 sm:px-6"
      >
        <div className="glass-card animate-float rounded-2xl p-5 shadow-xl shadow-brand-500/10">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 text-white">
              <Rocket className="size-4" />
            </span>
            <div>
              <p className="text-sm font-semibold">E-commerce Platform</p>
              <p className="text-xs text-ink/45 dark:text-white/45">
                Architecture preview
              </p>
            </div>
            <div className="ml-auto flex gap-1.5">
              <span className="size-2.5 rounded-full bg-red-400/70" />
              <span className="size-2.5 rounded-full bg-amber-400/70" />
              <span className="size-2.5 rounded-full bg-emerald-400/70" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {[
              { icon: Database, label: "Database", value: "12 tables · 3 indexes" },
              { icon: FileCode2, label: "API", value: "28 endpoints · REST" },
              { icon: FolderTree, label: "Structure", value: "Clean architecture" },
              { icon: LineChart, label: "Cost", value: "~$1.4k / mo at scale" },
            ].map(({ icon: Icon, label, value }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.12 }}
                className="flex items-center gap-3 rounded-xl bg-ink/[0.03] px-3 py-2.5 dark:bg-white/[0.04]"
              >
                <Icon className="size-4 text-brand-500" />
                <span className="text-xs font-medium text-ink/70 dark:text-white/70">
                  {label}
                </span>
                <span className="ml-auto text-xs text-ink/45 dark:text-white/45">
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
    description: "Structured, prioritized requirements derived from your idea.",
  },
  {
    icon: Database,
    title: "Database Design",
    description: "Normalized schema with tables, relationships and indexes.",
  },
  {
    icon: Workflow,
    title: "API Endpoints",
    description: "REST endpoints with methods, payloads and error handling.",
  },
  {
    icon: FolderTree,
    title: "Folder Structure",
    description: "Production-grade directory layout for any stack.",
  },
  {
    icon: Network,
    title: "System Architecture",
    description: "Components, services and data flow visualized end-to-end.",
  },
  {
    icon: Layers,
    title: "Diagrams",
    description: "Auto-generated Mermaid diagrams you can embed anywhere.",
  },
  {
    icon: LineChart,
    title: "Cost Estimation",
    description: "Infrastructure and operating cost forecasts by scale.",
  },
  {
    icon: Rocket,
    title: "Deployment Plan",
    description: "CI/CD, hosting, domains and rollout strategy included.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div {...fadeUp} className="mx-auto max-w-xl text-center">
          <Badge variant="brand">Features</Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything your idea needs to ship
          </h2>
          <p className="mt-3 text-pretty text-ink/55 dark:text-white/50">
            Stop hand-writing specs. Generate a complete engineering blueprint
            from a single prompt.
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
              <div className="glass-card group h-full rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-500/10">
                <div className="flex size-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500 transition-colors group-hover:bg-brand-500 group-hover:text-white dark:bg-brand-400/10 dark:text-brand-300">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm text-ink/55 dark:text-white/50">
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
  { value: "10+", label: "Engineering deliverables" },
  { value: "<60s", label: "Average generation time" },
  { value: "3", label: "Steps from idea to plan" },
  { value: "100%", label: "Exportable, ready to use" },
];

export function Stats() {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div {...fadeUp}>
          <div className="glass relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-500 to-violet-500 p-8 text-white shadow-xl shadow-brand-500/20 sm:p-12">
            <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/15 blur-3xl" />
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              {stats.map(({ value, label }) => (
                <div key={label}>
                  <p className="text-3xl font-bold tracking-tight sm:text-4xl">
                    {value}
                  </p>
                  <p className="mt-1.5 text-sm text-white/75">{label}</p>
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
      "Write one paragraph — or just a sentence — about what you want to build.",
  },
  {
    step: "02",
    title: "Generate the blueprint",
    description:
      "Our engine produces requirements, schema, APIs, architecture and more.",
  },
  {
    step: "03",
    title: "Review & refine",
    description:
      "Iterate on any section, then export and hand it straight to your team.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div {...fadeUp} className="mx-auto max-w-xl text-center">
          <Badge variant="brand">How it works</Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            From idea to architecture in minutes
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
              <div className="relative h-full rounded-2xl border border-ink/10 bg-white/50 p-6 dark:border-white/10 dark:bg-white/[0.03]">
                <span className="bg-gradient-to-r from-brand-500 to-violet-500 bg-clip-text text-4xl font-bold text-transparent">
                  {step}
                </span>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm text-ink/55 dark:text-white/50">
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
    question: "What exactly will the AI generate?",
    answer:
      "Requirements, database design, API endpoints, folder structure, system architecture, Mermaid diagrams, deployment plan, development timeline, cost estimation and documentation.",
  },
  {
    question: "What can I do today?",
    answer:
      "Milestone 1 delivers the full product foundation: secure accounts, JWT authentication, project management, and the premium app shell. AI generation arrives in the next milestone.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Passwords are hashed with bcrypt and authentication uses signed JWTs. Your projects are scoped to your account and never shared.",
  },
  {
    question: "Can I export the architecture?",
    answer:
      "Yes. Every generated artifact will be exportable as Markdown or Mermaid, ready to embed in Notion, GitHub, or your docs.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <motion.div {...fadeUp} className="text-center">
          <Badge variant="brand">FAQ</Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
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
                className="glass-card overflow-hidden rounded-2xl"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-medium">{question}</span>
                  <ChevronDown
                    className={`size-4.5 shrink-0 text-ink/40 transition-transform duration-300 dark:text-white/40 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="px-5 pb-4 text-sm text-ink/55 dark:text-white/50">
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
          <div className="glass relative overflow-hidden rounded-3xl border-ink/10 p-10 text-center dark:border-white/10 sm:p-16">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-400/30 to-violet-400/30 blur-3xl" />
            <h2 className="mx-auto max-w-lg text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Your next project starts with one sentence
            </h2>
            <p className="mx-auto mt-3 max-w-md text-pretty text-ink/55 dark:text-white/50">
              Join today and get your first blueprint — free.
            </p>
            <div className="mt-8 flex justify-center">
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