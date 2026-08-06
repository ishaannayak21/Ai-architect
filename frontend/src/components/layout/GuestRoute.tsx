import { Navigate, Outlet } from "react-router-dom";

import { ROUTES } from "@/constants";
import { useAuth } from "@/hooks/useAuth";

export function GuestRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
}