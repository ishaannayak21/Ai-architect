import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants";

interface ProjectRowItem {
  id: string;
  num: string;
  title: string;
  description: string;
  techStack: string[];
  href: string;
}

const SAMPLE_PROJECTS: ProjectRowItem[] = [
  {
    id: "1",
    num: "01",
    title: "AI Software Architect",
    description: "AI platform that turns ideas into complete software architecture blueprints",
    techStack: ["REACT", "FASTAPI", "GEMINI AI"],
    href: ROUTES.DASHBOARD,
  },
  {
    id: "2",
    num: "02",
    title: "Task Management System",
    description: "Collaborative task manager with real-time updates and analytics",
    techStack: ["NEXT.JS", "TAILWIND", "POSTGRESQL"],
    href: ROUTES.DASHBOARD,
  },
  {
    id: "3",
    num: "03",
    title: "DocuChat AI",
    description: "Chat with PDF documents using AI embeddings and semantic search",
    techStack: ["PYTHON", "CHROMADB", "OPENAI"],
    href: ROUTES.DASHBOARD,
  },
  {
    id: "4",
    num: "04",
    title: "DevOps Dashboard",
    description: "Monitoring server performance and deployment pipelines in real-time",
    techStack: ["DOCKER", "PROMETHEUS", "GRAFANA"],
    href: ROUTES.DASHBOARD,
  },
  {
    id: "5",
    num: "05",
    title: "E-Learning Platform",
    description: "Modern learning platform with video streaming and progress tracking",
    techStack: ["MERN STACK", "AWS S3", "STRIPE"],
    href: ROUTES.DASHBOARD,
  },
];

export function SelectedWorkSection() {
  return (
    <section id="projects" className="py-20 border-t border-stone-200 dark:border-stone-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 pb-12 border-b border-stone-200 dark:border-stone-800">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-orange-500">
              (01) - SELECTED WORK
            </span>
            <h2 className="mt-3 font-sans text-4xl font-extrabold uppercase tracking-tight text-stone-900 dark:text-white sm:text-6xl">
              PROJECTS I'VE{" "}
              <span className="font-serif italic font-normal text-orange-500 lowercase">
                architected
              </span>
            </h2>
          </div>
          <div className="font-mono text-xs text-stone-500 dark:text-stone-400">
            2024 / 2025
          </div>
        </div>

        {/* Project Rows */}
        <div className="divide-y divide-stone-200 dark:divide-stone-800">
          {SAMPLE_PROJECTS.map((proj, idx) => (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
            >
              <Link
                to={proj.href}
                className="group grid grid-cols-1 gap-4 py-8 md:grid-cols-12 md:items-center transition-all hover:bg-stone-100/50 dark:hover:bg-stone-900/40 px-2 sm:px-4 rounded-xl"
              >
                {/* Number */}
                <div className="md:col-span-1 font-mono text-sm font-semibold text-stone-400 dark:text-stone-500">
                  {proj.num}
                </div>

                {/* Title */}
                <div className="md:col-span-4">
                  <h3 className="font-sans text-xl font-bold tracking-tight text-stone-900 transition-colors group-hover:text-orange-500 dark:text-white dark:group-hover:text-orange-500 sm:text-2xl">
                    {proj.title}
                  </h3>
                </div>

                {/* Description */}
                <div className="md:col-span-4">
                  <p className="font-sans text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                {/* Tech Stack Tags & Arrow */}
                <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-4">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    {proj.techStack.join(" · ")}
                  </span>
                  <ArrowUpRight className="size-5 shrink-0 text-stone-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-orange-500 dark:text-stone-500" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
