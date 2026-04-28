export type TicketStatus =
  | "pending"
  | "in_progress"
  | "blocked"
  | "ready"
  | "closed";

export type TicketPriority = "low" | "medium" | "high" | "critical";

export type Ticket = {
  id: number;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  incident_date: string;
};

export type TicketListProps = {
  tickets: Ticket[];
  isLoading?: boolean;
  error?: string | null;
};
