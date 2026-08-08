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
        <h2 className="font-serif text-3xl font-bold tracking-tight text-[#1F2421] dark:text-[#E6ECE7] sm:text-4xl">
          Welcome back, {firstName}
        </h2>
        <p className="mt-2 font-sans text-sm text-[#6B726C] dark:text-[#A3B5A7]">
          Your architectural ideas are ready to be transformed into blueprints.
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
              hint="Ideas in workspace"
              accentClassName="bg-[#FDF3EE] text-[#C05621] border border-[#F3D9C8] dark:bg-[#331C13] dark:text-[#E07A48]"
            />
            <StatCard
              icon={<RefreshCw className="size-4.5" />}
              label="Updated this week"
              value={String(recentlyUpdated.length)}
              hint="Active in last 7 days"
              accentClassName="bg-[#E8F0EA] text-[#223829] border border-[#C5D8C9] dark:bg-[#243226] dark:text-[#A3B5A7]"
            />
            <StatCard
              icon={<FileText className="size-4.5" />}
              label="Description words"
              value={totalWords.toLocaleString()}
              hint="AI engine context"
              accentClassName="bg-[#FAF7F2] text-[#1F2421] border border-[#E6DFD5] dark:bg-[#1E2B21] dark:text-[#E6ECE7]"
            />
            <StatCard
              icon={<CalendarDays className="size-4.5" />}
              label="Started this month"
              value={String(createdThisMonth.length)}
              hint="New ideas this month"
              accentClassName="bg-[#FDF3EE] text-[#C05621] border border-[#F3D9C8] dark:bg-[#331C13] dark:text-[#E07A48]"
            />
          </>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_ACTIONS.map(({ label, description, icon: Icon, to }) => (
          <Link key={label} to={to}>
            <Card
              hover
              className="group flex items-center gap-4 p-5"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#E6DFD5] bg-[#FFFFFF] text-[#1F2421] transition-all group-hover:border-[#C05621] group-hover:bg-[#C05621] group-hover:text-white dark:border-[#2B3D2F] dark:bg-[#1A241C] dark:text-[#E6ECE7]">
                <Icon className="size-4.5" />
              </span>
              <div className="min-w-0">
                <p className="font-serif font-bold text-[#1F2421] dark:text-[#E6ECE7] text-base">{label}</p>
                <p className="truncate font-sans text-xs text-[#6B726C] dark:text-[#A3B5A7]">
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
          <h3 className="font-serif text-2xl font-bold tracking-tight text-[#1F2421] dark:text-[#E6ECE7]">Recent projects</h3>
          <Link
            to={ROUTES.PROJECTS}
            className="font-mono text-xs font-semibold uppercase tracking-wider text-[#C05621] hover:text-[#A8481A] dark:text-[#E07A48]"
          >
            View all projects →
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