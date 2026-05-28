export type TicketType = "error" | "suggestion";

export type TicketStatus =
  | "pending"
  | "in_progress"
  | "blocked"
  | "ready"
  | "closed";

export type TicketPriority = "low" | "medium" | "high" | "critical";

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

export type Ticket = {
  id: number;
  name: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  type: TicketType;
  incident_date: string;
  affected_app?: AffectedApp;
  affected_function?: AffectedFunction;
  assignee?: TicketUserData | null;
  codeConnect?: TicketUserData | null;
  closed_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type IntCreateTicket = {
  description: string;
  name?: string;
  incident_date?: string;
  affected_app?: AffectedApp;
  type?: TicketType;
  affected_function?: AffectedFunction;
};

export interface IntTicket extends IntCreateTicket {
  id: number;
  code_connect_id: number;
  status: TicketStatus;
  priority: TicketPriority;
  closed_by?: number | null;
  closed_at?: string | null;
  created_at: string;
  updated_at: string;
}

export type TicketListProps = {
  tickets: ApiTicketData[];
  isLoading?: boolean;
  error?: string | null;
  onCommentClick?: (id: number) => void;
};

export interface TicketUserData {
  id: number;
  github_id?: string | null;
  github_user_name?: string | null;
  name?: string | null;
  email?: string | null;
  role?: string | null;
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

export interface IntUpdateTicket {
  status?: TicketStatus;
  priority?: TicketPriority;
}

export interface ApiUpdateTicketResponse {
  success: boolean;
  data: ApiTicketData;
  message?: string;
}

export interface TicketComment {
  id: number;
  ticket_id: number;
  user_id: number;
  comment: string;
  is_closing_comment: boolean;
  created_at: string;
  updated_at: string;
  user: TicketUserData;
}
