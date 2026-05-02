export type TicketStatus =
  | "pending"
  | "in_progress"
  | "blocked"
  | "ready"
  | "closed";
export type TicketPriority = "low" | "medium" | "high" | "critical";
export type TicketType = "error" | "suggestion";

export type TicketUser = {
  id: number;
  name: string;
  github_user_name?: string;
  email?: string;
};

export type Ticket = {
  id: number;
  name: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  type: TicketType;
  incident_date: string;
  affected_app?: string;
  affected_function?: string;
  assignee?: TicketUser | null;
  codeConnect?: TicketUser | null;
  closed_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type IntCreateTicket = {
  name: string;
  incident_date: string;
  affected_app?: string;
  type: TicketType;
  affected_function?: string;
  description: string;
};

export type TicketListProps = {
  tickets: Ticket[];
  isLoading?: boolean;
  error?: string | null;
};

export type TicketPriority = "low" | "medium" | "high" | "critical";

export type TicketType = "error" | "suggestion";

export type AffectedApp =
  | "wiki_frontend"
  | "wiki_backend"
  | "code_connect"
  | "other";

export type AffectedFunction =
  | "login"
  | "challenges"
  | "resources"
  | "profile"
  | "technical_tests"
  | "code_connect"
  | "other";

export interface TicketUserData {
  id: number;
  github_id?: string | null;
  github_user_name?: string | null;
  name?: string | null;
  email?: string | null;
}

export interface ApiTicketData {
  id: number;
  code_connect_id: number;
  forum_answer_id: number | null;
  name: string;
  incident_date: string;
  affected_app: AffectedApp;
  type: TicketType;
  affected_function: AffectedFunction;
  description: string;
  status: TicketStatus;
  priority: TicketPriority | null;
  assignee_id: number | null;
  closed_by: number | null;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
  code_connect?: TicketUserData | null;
  assignee?: TicketUserData | null;
  closed_by_user?: TicketUserData | null;
}

export interface ApiTicketsResponse {
  success: boolean;
  data: ApiTicketData[];
  message?: string;
}

export interface TicketingError {
  message: string;
  status?: number;
  code?: string;
}

export interface UseTicketingGetAllState {
  tickets: ApiTicketData[];
  isLoading: boolean;
  errorMessage: string | null;
}
