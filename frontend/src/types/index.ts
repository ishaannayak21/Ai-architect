export interface User {
  id: number;
  name: string;
  email: string;
  is_admin?: boolean;
  created_at: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  owner_id: number;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
}

export interface CreateProjectPayload {
  title: string;
  description: string;
}

export interface UpdateProjectPayload {
  title?: string;
  description?: string;
}

export interface BlueprintDatabaseTable {
  name: string;
  purpose?: string;
  columns?: string[] | null;
}

export interface BlueprintApiEndpoint {
  method: string;
  path: string;
  description?: string;
}

export interface ArchitectBlueprint {
  project_summary: string;
  functional_requirements: string[];
  non_functional_requirements: string[];
  user_roles: string[];
  core_features: string[];
  recommended_tech_stack: string[];
  database_tables: BlueprintDatabaseTable[];
  rest_api_endpoints: BlueprintApiEndpoint[];
  folder_structure: string | string[];
  security_recommendations: string[];
  deployment_strategy: string[];
  development_timeline: string[];
  estimated_team_size: number | string | null;
}

export interface Blueprint {
  id: number;
  title: string;
  description: string;
  data: ArchitectBlueprint;
  created_at: string;
}

export interface GenerateBlueprintPayload {
  title: string;
  description?: string;
}

export const DIAGRAM_TYPES = [
  "system_architecture",
  "database_er",
  "application_flowchart",
  "api_sequence",
  "deployment",
] as const;

export type DiagramType = (typeof DIAGRAM_TYPES)[number];

export interface Diagram {
  id: number;
  blueprint_id: number;
  diagram_type: DiagramType;
  mermaid_code: string;
  created_at: string;
}

export type DiagramsByType = Partial<Record<DiagramType, Diagram>>;

export interface UseCaseItem {
  title: string;
  actor: string;
  preconditions: string;
  main_flow: string[];
  postconditions: string;
}

export interface FutureEnhancementItem {
  title: string;
  description: string;
  impact: "High" | "Medium" | "Low" | string;
}

export interface DocumentationData {
  executive_summary: string;
  project_vision: string;
  functional_requirements: string[];
  non_functional_requirements: string[];
  user_roles: string[];
  use_cases: UseCaseItem[];
  tech_stack: string[];
  database_tables: BlueprintDatabaseTable[];
  api_endpoints: BlueprintApiEndpoint[];
  folder_structure: string | string[];
  system_architecture_description: string;
  deployment_strategy: string[];
  development_timeline: string[];
  future_enhancements: FutureEnhancementItem[];
}

export interface Documentation {
  id: number;
  blueprint_id: number;
  data: DocumentationData;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: number;
  session_id: number;
  role: "user" | "assistant" | "system";
  content: string;
  updated_section?: string | null;
  created_at: string;
}

export interface ChatSession {
  id: number;
  blueprint_id: number;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}
