export type TicketType = "error" | "suggestion";
export type TicketStatus = "pending" | "in_progress" | "blocked" | "ready" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "critical";
export type AffectedApp = "wiki_frontend" | "wiki_backend" | "code_connect" | "other";
export type AffectedFunction =
  | "login"
  | "challenges"
  | "resources"
  | "profile"
  | "technical_tests"
  | "code_connect"
  | "other";

export interface IntCreateTicket {
  name: string;
  incident_date: string;
  affected_app: AffectedApp;
  type: TicketType;
  affected_function: AffectedFunction;
  description: string;
  forum_answer_id?: number | null;
  assignee_id?: number | null;
}

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
