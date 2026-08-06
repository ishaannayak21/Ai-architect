import { motion } from "framer-motion";
import {
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

import { ProjectCard } from "@/components/projects/ProjectCard";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
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
    description: "Browse & manage ideas",
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
    description: "Preferences & theme",
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
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold tracking-tight">
          Welcome back, {firstName}
        </h2>
        <p className="mt-1 text-sm text-ink/55 dark:text-white/50">
          Your ideas are ready to become architecture.
        </p>
      </motion.div>

      {/* Analytics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-2xl" />
          ))
        ) : (
          <>
            <StatCard
              icon={<FolderKanban className="size-4.5" />}
              label="Total projects"
              value={String(projects.length)}
              hint="Ideas in your workspace"
            />
            <StatCard
              icon={<RefreshCw className="size-4.5" />}
              label="Updated this week"
              value={String(recentlyUpdated.length)}
              hint="Active in the last 7 days"
              accentClassName="bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300"
            />
            <StatCard
              icon={<FileText className="size-4.5" />}
              label="Description words"
              value={totalWords.toLocaleString()}
              hint="Context for the AI engine"
              accentClassName="bg-violet-500/10 text-violet-600 dark:bg-violet-400/10 dark:text-violet-300"
            />
            <StatCard
              icon={<CalendarDays className="size-4.5" />}
              label="Started this month"
              value={String(createdThisMonth.length)}
              hint="New ideas this month"
              accentClassName="bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300"
            />
          </>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_ACTIONS.map(({ label, description, icon: Icon, to }) => (
          <Link key={label} to={to}>
            <Card
              hover
              className="group flex items-center gap-3 p-4"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500 transition-colors group-hover:bg-brand-500 group-hover:text-white dark:bg-brand-400/10 dark:text-brand-300">
                <Icon className="size-4.5" />
              </span>
              <div className="min-w-0">
                <p className="font-medium">{label}</p>
                <p className="truncate text-xs text-ink/45 dark:text-white/45">
                  {description}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold tracking-tight">Recent projects</h3>
          <Link
            to={ROUTES.PROJECTS}
            className="text-sm font-medium text-brand-500 hover:text-brand-400"
          >
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-44 rounded-2xl" />
            <Skeleton className="h-44 rounded-2xl" />
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            icon={<Sparkles className="size-6" />}
            title="No projects yet"
            description="Describe your first software idea and we'll turn it into a complete engineering blueprint."
            action={
              <Button onClick={openProject}>
                <Plus className="size-4" />
                Create your first project
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {projects.slice(0, 4).map((project) => (
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