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
