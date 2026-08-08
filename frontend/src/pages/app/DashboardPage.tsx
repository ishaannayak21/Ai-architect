import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  FileText,
  FolderKanban,
  Plus,
  RefreshCw,
  Settings,
  Sparkles,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { DashboardMarquee } from "@/components/layout/DashboardMarquee";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatCard } from "@/components/ui/StatCard";
import { ROUTES } from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import { useProjects } from "@/hooks/useProjects";

const QUICK_ACTIONS = [
  {
    label: "New project",
    description: "Describe a new idea",
    icon: Plus,
    to: ROUTES.NEW_PROJECT,
  },
  {
    label: "All projects",
    description: "Browse & manage",
    icon: FolderKanban,
    to: ROUTES.PROJECTS,
  },
  {
    label: "Profile",
    description: "Update your account",
    icon: User,
    to: ROUTES.PROFILE,
  },
  {
    label: "Settings",
    description: "Preferences & more",
    icon: Settings,
    to: ROUTES.SETTINGS,
  },
];

export function DashboardPage() {
  const { user } = useAuth();
  const { projects, isLoading } = useProjects();
  const navigate = useNavigate();

  const firstName = user?.name.split(" ")[0] ?? "there";
  const now = Date.now();
  const day = 86_400_000;
  const weekAgo = new Date(now - 7 * day).toISOString();
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

  const recentlyUpdated = projects.filter((p) => p.updated_at >= weekAgo);
  const createdThisMonth = projects.filter((p) => p.created_at >= monthStart);
  const totalWords = projects.reduce(
    (sum, p) => sum + (p.description ? p.description.split(/\s+/).length : 0),
    0,
  );

  const openProject = () => navigate(`${ROUTES.PROJECTS}?new=1`);

  return (
    <div className="space-y-8">
      {/* Top Feature Marquee directly below Dashboard Header */}
      <DashboardMarquee />

      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl border border-stone-200 bg-white p-8 dark:border-stone-800/80 dark:bg-[#111111]"
      >
        <div className="relative z-10 max-w-2xl">
          <h2 className="font-sans text-3xl font-extrabold uppercase tracking-tight text-stone-900 dark:text-white sm:text-5xl">
            Welcome back,{" "}
            <span className="font-serif italic font-normal text-orange-500 lowercase">
              {firstName}
            </span>
          </h2>
          <p className="mt-3 font-sans text-base text-stone-600 dark:text-stone-400">
            Your architectural ideas are ready to be transformed into blueprints.
          </p>
        </div>

        {/* Dot Matrix Decorative Pattern matching reference screenshot */}
        <div className="pointer-events-none absolute -right-6 -top-6 hidden lg:block opacity-20 dark:opacity-25">
          <div className="grid grid-cols-12 gap-3 p-8">
            {Array.from({ length: 48 }).map((_, i) => (
              <span key={i} className="size-1.5 rounded-full bg-orange-500" />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-2xl" />
          ))
        ) : (
          <>
            <StatCard
              icon={<FolderKanban className="size-5" />}
              label="TOTAL PROJECTS"
              value={String(projects.length)}
              hint="Ideas in workspace"
              accentClassName="border border-orange-500/30 bg-orange-500/10 text-orange-500"
            />
            <StatCard
              icon={<RefreshCw className="size-5" />}
              label="UPDATED THIS WEEK"
              value={String(recentlyUpdated.length)}
              hint="Active in last 7 days"
              accentClassName="border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
            />
            <StatCard
              icon={<FileText className="size-5" />}
              label="DESCRIPTION WORDS"
              value={totalWords.toLocaleString()}
              hint="AI engine context"
              accentClassName="border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
            />
            <StatCard
              icon={<CalendarDays className="size-5" />}
              label="STARTED THIS MONTH"
              value={String(createdThisMonth.length)}
              hint="New ideas this month"
              accentClassName="border border-orange-500/30 bg-orange-500/10 text-orange-500"
            />
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400">
          QUICK ACTIONS
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_ACTIONS.map(({ label, description, icon: Icon, to }) => (
            <Link key={label} to={to}>
              <div className="group flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-5 transition-all duration-200 hover:border-stone-300 dark:border-stone-800/80 dark:bg-[#111111] dark:hover:border-stone-700">
                <div className="flex items-center gap-4 min-w-0">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-stone-200 bg-stone-50 text-stone-900 transition-colors group-hover:border-orange-500 group-hover:bg-orange-600 group-hover:text-white dark:border-stone-800 dark:bg-[#1a1a1a] dark:text-stone-200">
                    <Icon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-sans font-bold text-stone-900 dark:text-white text-base">
                      {label}
                    </p>
                    <p className="truncate font-mono text-xs text-stone-500 dark:text-stone-400">
                      {description}
                    </p>
                  </div>
                </div>
                <ArrowRight className="size-4 shrink-0 text-stone-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-orange-500" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Projects */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-3xl font-normal tracking-tight text-stone-900 dark:text-white">
            Recent projects
          </h3>
          <Link
            to={ROUTES.PROJECTS}
            className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-orange-500 hover:text-orange-400 transition-colors"
          >
            <span>VIEW ALL PROJECTS</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-52 rounded-2xl" />
            <Skeleton className="h-52 rounded-2xl" />
            <Skeleton className="h-52 rounded-2xl" />
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            icon={<Sparkles className="size-6 text-orange-500" />}
            title="No projects yet"
            description="Describe your first software idea and we'll turn it into a complete engineering blueprint."
            action={
              <Button onClick={openProject} className="bg-orange-600 hover:bg-orange-500 text-white rounded-full px-6">
                <Plus className="size-4" />
                Create your first project
              </Button>
            }
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 6).map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={() => navigate(ROUTES.PROJECTS)}
                onDelete={() => navigate(ROUTES.PROJECTS)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}