import { lazy, Suspense, type ReactNode } from "react";
import { Route, Routes } from "react-router-dom";

import { AppShell } from "@/components/layout/AppShell";
import { GuestRoute } from "@/components/layout/GuestRoute";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { Spinner } from "@/components/ui/Spinner";
import { ROUTES } from "@/constants";

const LandingPage = lazy(() =>
  import("@/pages/landing/LandingPage").then((module) => ({
    default: module.LandingPage,
  })),
);
const LoginPage = lazy(() =>
  import("@/pages/auth/LoginPage").then((module) => ({
    default: module.LoginPage,
  })),
);
const RegisterPage = lazy(() =>
  import("@/pages/auth/RegisterPage").then((module) => ({
    default: module.RegisterPage,
  })),
);
const DashboardPage = lazy(() =>
  import("@/pages/app/DashboardPage").then((module) => ({
    default: module.DashboardPage,
  })),
);
const ProjectsPage = lazy(() =>
  import("@/pages/app/ProjectsPage").then((module) => ({
    default: module.ProjectsPage,
  })),
);
const NewProjectPage = lazy(() =>
  import("@/pages/app/NewProjectPage").then((module) => ({
    default: module.NewProjectPage,
  })),
);
const BlueprintHistoryPage = lazy(() =>
  import("@/pages/app/BlueprintHistoryPage").then((module) => ({
    default: module.BlueprintHistoryPage,
  })),
);
const BlueprintViewPage = lazy(() =>
  import("@/pages/app/BlueprintViewPage").then((module) => ({
    default: module.BlueprintViewPage,
  })),
);
const DocumentationPage = lazy(() =>
  import("@/pages/app/DocumentationPage").then((module) => ({
    default: module.DocumentationPage,
  })),
);
const ProfilePage = lazy(() =>
  import("@/pages/app/ProfilePage").then((module) => ({
    default: module.ProfilePage,
  })),
);
const SettingsPage = lazy(() =>
  import("@/pages/app/SettingsPage").then((module) => ({
    default: module.SettingsPage,
  })),
);
const NotFoundPage = lazy(() =>
  import("@/pages/NotFoundPage").then((module) => ({
    default: module.NotFoundPage,
  })),
);

function PageLoader({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageFallback />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner className="size-7 text-brand-500" />
    </div>
  );
}

import { CustomCursor } from "@/components/ui/CustomCursor";

export default function App() {
  return (
    <PageLoader>
      <CustomCursor />
      <Routes>
        <Route path={ROUTES.HOME} element={<LandingPage />} />

        <Route element={<GuestRoute />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            <Route path={ROUTES.PROJECTS} element={<ProjectsPage />} />
            <Route path={ROUTES.NEW_PROJECT} element={<NewProjectPage />} />
            <Route
              path={ROUTES.BLUEPRINT_DETAIL}
              element={<BlueprintViewPage />}
            />
            <Route
              path={ROUTES.DOCUMENTATION_DETAIL}
              element={<DocumentationPage />}
            />
            <Route path={ROUTES.BLUEPRINTS} element={<BlueprintHistoryPage />} />
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </PageLoader>
  );
}