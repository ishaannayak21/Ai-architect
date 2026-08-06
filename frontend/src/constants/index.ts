export const APP_NAME = "AI Software Architect";
export const APP_TAGLINE = "From idea to architecture";

export const API_URL = import.meta.env.VITE_API_URL ?? "/api/v1";

export const TOKEN_STORAGE_KEY = "ai_architect_token";
export const THEME_STORAGE_KEY = "ai_architect_theme";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  PROJECTS: "/projects",
  NEW_PROJECT: "/projects/new",
  BLUEPRINTS: "/blueprints",
  BLUEPRINT_DETAIL: "/blueprints/:id",
  DOCUMENTATION_DETAIL: "/blueprints/:id/documentation",
  PROFILE: "/profile",
  SETTINGS: "/settings",
} as const;
