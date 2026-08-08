import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Database,
  FileCode2,
  FolderTree,
  LineChart,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants";

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pb-16 pt-20 sm:pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 font-mono text-xs font-bold uppercase tracking-widest text-orange-500">
            <span>✦</span>
            <span>NEXT-GEN AI ARCHITECTURE ENGINE</span>
          </div>

          <h1 className="mt-8 font-sans text-4xl font-black uppercase leading-[1.08] tracking-tight text-stone-900 dark:text-white sm:text-7xl">
            TURN A SINGLE SENTENCE INTO A{" "}
            <span className="font-serif italic font-normal text-orange-500 lowercase">
              complete software blueprint
            </span>
          </h1>

          <p className="mt-6 max-w-2xl font-sans text-base text-stone-600 dark:text-stone-400 sm:text-lg leading-relaxed">
            Describe your application concept — e.g. "Hospital ERP System" or "E-Commerce Platform".
            Our senior architect engine drafts database schemas, REST contracts, system topology,
            Mermaid diagrams, and exportable documentation in seconds.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link to={ROUTES.REGISTER}>
              <Button size="lg" className="rounded-full bg-orange-600 px-8 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-white hover:bg-orange-500">
                START ARCHITECTING FREE
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link to={ROUTES.LOGIN}>
              <Button size="lg" variant="outline" className="rounded-full border-stone-300 dark:border-stone-800 px-8 py-3.5 font-mono text-xs font-bold uppercase tracking-wider">
                SIGN IN TO WORKSPACE
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Live Interactive Spec Card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.55 }}
          className="mt-16 overflow-hidden rounded-2xl border border-stone-200 bg-white p-6 shadow-xl dark:border-stone-800 dark:bg-[#0c0c0c]"
        >
          <div className="flex items-center justify-between border-b border-stone-200 pb-4 dark:border-stone-800">
            <div className="flex items-center gap-3">
              <span className="flex size-3 rounded-full bg-orange-500" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-stone-900 dark:text-white">
                LIVE ENGINE SPECIFICATION OUTPUT
              </span>
            </div>
            <span className="font-mono text-xs text-stone-400">0.42s RUNTIME</span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Database, label: "Database Schema", detail: "12 tables · Relational ERD · Indexes" },
              { icon: FileCode2, label: "REST Contracts", detail: "28 endpoints · Status Codes · JSON" },
              { icon: FolderTree, label: "Directory Layout", detail: "Layered Clean Architecture" },
              { icon: LineChart, label: "Scaling & Cost", detail: "Microservice CDN Topology" },
            ].map(({ icon: Icon, label, detail }) => (
              <div
                key={label}
                className="group rounded-xl border border-stone-200 bg-stone-50 p-4 transition-all hover:border-orange-500/40 dark:border-stone-800/80 dark:bg-[#121212]"
              >
                <Icon className="size-5 text-orange-500" />
                <h4 className="mt-3 font-sans text-sm font-bold text-stone-900 dark:text-white">{label}</h4>
                <p className="mt-1 font-mono text-xs text-stone-500 dark:text-stone-400">{detail}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const featuresList = [
  {
    num: "01",
    title: "Functional Requirements",
    description: "Structured, prioritized specifications and actor workflows derived directly from your input prompt.",
    tech: "REQUIREMENTS ENGINE",
  },
  {
    num: "02",
    title: "Database Schema Design",
    description: "Normalized relational & document schemas complete with field types, foreign keys, and indexes.",
    tech: "POSTGRESQL · SQLITE",
  },
  {
    num: "03",
    title: "REST API Contracts",
    description: "Production REST endpoint definitions with HTTP methods, route parameters, request payloads, and status codes.",
    tech: "RESTFUL SPEC",
  },
  {
    num: "04",
    title: "Directory & Folder Tree",
    description: "Production-ready repository layout tailored specifically to your chosen framework and tech stack.",
    tech: "CLEAN ARCHITECTURE",
  },
  {
    num: "05",
    title: "System Topology & Architecture",
    description: "Component interaction hierarchy, caching layer boundaries, load balancer nodes, and data flow.",
    tech: "DECOUPLED DESIGN",
  },
  {
    num: "06",
    title: "Interactive Mermaid Diagrams",
    description: "Auto-generated System Architecture, ERD, Application Flowchart, API Sequence, and Deployment diagrams.",
    tech: "MERMAID.JS",
  },
  {
    num: "07",
    title: "14-Section Smart Documentation",
    description: "Comprehensive executive documentation manual compiled instantly with zero manual authoring.",
    tech: "PDF · HTML · MARKDOWN",
  },
  {
    num: "08",
    title: "AI Architect Chat Assistant",
    description: "Context-aware conversational assistant to modify, security-harden, or scale your architecture dynamically.",
    tech: "GEMINI AI ENGINE",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 border-t border-stone-200 dark:border-stone-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 pb-12 border-b border-stone-200 dark:border-stone-800">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-orange-500">
              (02) - FEATURES MATRIX
            </span>
            <h2 className="mt-3 font-sans text-4xl font-extrabold uppercase tracking-tight text-stone-900 dark:text-white sm:text-5xl">
              ENGINEERING DELIVERABLES{" "}
              <span className="font-serif italic font-normal text-orange-500 lowercase">
                generated
              </span>
            </h2>
          </div>
        </div>

        <div className="divide-y divide-stone-200 dark:divide-stone-800">
          {featuresList.map((feat, idx) => (
            <motion.div
              key={feat.num}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              className="group grid grid-cols-1 gap-4 py-7 md:grid-cols-12 md:items-center px-2 sm:px-4 rounded-xl transition-all hover:bg-stone-100/50 dark:hover:bg-stone-900/40"
            >
              <div className="md:col-span-1 font-mono text-sm font-semibold text-stone-400 dark:text-stone-500">
                {feat.num}
              </div>
              <div className="md:col-span-4">
                <h3 className="font-sans text-xl font-bold text-stone-900 transition-colors group-hover:text-orange-500 dark:text-white">
                  {feat.title}
                </h3>
              </div>
              <div className="md:col-span-5">
                <p className="font-sans text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
              <div className="md:col-span-2 text-right">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-orange-500">
                  {feat.tech}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const stats = [
  { value: "14+", label: "Documentation Sections" },
  { value: "<60s", label: "Average Generation Time" },
  { value: "5", label: "Mermaid Diagram Views" },
  { value: "100%", label: "Exportable PDF / HTML / MD" },
];

export function Stats() {
  return (
    <section className="py-16 border-t border-stone-200 dark:border-stone-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map(({ value, label }) => (
            <div key={label} className="border-l-2 border-orange-500 pl-6">
              <p className="font-mono text-4xl font-extrabold text-stone-900 dark:text-white sm:text-5xl">
                {value}
              </p>
              <p className="mt-2 font-mono text-xs font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    step: "01",
    title: "DESCRIBE CONCEPT",
    description: "Input a title and optional description detailing your web application or system concept.",
  },
  {
    step: "02",
    title: "AI ENGINE GENERATES",
    description: "Gemini architecture model designs database schemas, API routes, system topology, and Mermaid code.",
  },
  {
    step: "03",
    title: "INSPECT & EXPORT",
    description: "Review interactive diagrams, converse with AI Chat, and download standalone PDF, HTML, or Markdown.",
  },
];

export function HowItWorks() {
  return (
    <section id="about" className="py-20 border-t border-stone-200 dark:border-stone-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="pb-12 border-b border-stone-200 dark:border-stone-800">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-orange-500">
            (03) - HOW IT WORKS
          </span>
          <h2 className="mt-3 font-sans text-4xl font-extrabold uppercase tracking-tight text-stone-900 dark:text-white sm:text-5xl">
            FROM PROMPT TO ARCHITECTURE IN{" "}
            <span className="font-serif italic font-normal text-orange-500 lowercase">
              three steps
            </span>
          </h2>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map(({ step, title, description }, index) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="rounded-2xl border border-stone-200 bg-stone-50/50 p-8 dark:border-stone-800 dark:bg-[#0e0e0e]"
            >
              <span className="font-mono text-3xl font-extrabold text-orange-500">
                {step}
              </span>
              <h3 className="mt-6 font-sans text-lg font-bold uppercase tracking-tight text-stone-900 dark:text-white">
                {title}
              </h3>
              <p className="mt-3 font-sans text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const faqs: Array<{ question: string; answer: string }> = [
  {
    question: "What engineering deliverables are generated?",
    answer: "Every project blueprint produces a 14-section manual containing Functional Requirements, Non-Functional Requirements, User Roles, Use Cases, Tech Stack, Database Schema Tables, REST API Contracts, Folder Structure, System Architecture Topology, Deployment Strategy, Development Timeline, Future Enhancements, 5 Mermaid Diagrams, and interactive AI Chat context.",
  },
  {
    question: "How do HTML and PDF exports work?",
    answer: "You can download standalone HTML documentation with client-side Mermaid rendering scripts embedded, or multi-page PDF reports complete with cover pages, section headers, formatted tables, and header/footer page numbering.",
  },
  {
    question: "Is AI Chat session history persisted?",
    answer: "Yes! Every project maintains a persistent chat session in the database so you can return to any project, view past conversation history, or continue refining your architecture.",
  },
  {
    question: "Does viewing cached documentation trigger AI requests?",
    answer: "No. Documentation and diagrams are generated and cached directly in SQLite upon project creation. Reopening projects, viewing documentation, or exporting files uses 0 AI quota requests.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 border-t border-stone-200 dark:border-stone-800">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="pb-12 text-center">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-orange-500">
            (04) - FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="mt-3 font-sans text-4xl font-extrabold uppercase tracking-tight text-stone-900 dark:text-white">
            NEED{" "}
            <span className="font-serif italic font-normal text-orange-500 lowercase">
              clarification?
            </span>
          </h2>
        </div>

        <div className="divide-y divide-stone-200 dark:divide-stone-800">
          {faqs.map(({ question, answer }, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={question} className="py-6">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full cursor-pointer items-center justify-between text-left font-sans text-lg font-bold text-stone-900 dark:text-white"
                >
                  <span>{question}</span>
                  <ChevronDown
                    className={`size-5 text-orange-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-4 font-sans text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                    {answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function CtaSection() {
  return (
    <section id="contact" className="py-20 border-t border-stone-200 dark:border-stone-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-3xl border border-stone-200 bg-stone-900 p-12 text-center text-white dark:border-stone-800 dark:bg-[#0b0b0b]">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-orange-500">
            READY TO BUILD?
          </span>
          <h2 className="mt-4 font-sans text-4xl font-black uppercase tracking-tight sm:text-6xl">
            START YOUR NEXT{" "}
            <span className="font-serif italic font-normal text-orange-500 lowercase">
              architecture design
            </span>
          </h2>
          <div className="mt-8 flex justify-center">
            <Link to={ROUTES.REGISTER}>
              <Button size="lg" className="rounded-full bg-orange-600 px-8 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-white hover:bg-orange-500">
                CREATE FREE ACCOUNT
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}