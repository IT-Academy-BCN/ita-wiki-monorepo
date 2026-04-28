export type Ticket = {
  id: number;
  description: string;
  status: string;
  priority: string;
  incident_date: string;
};

export type TicketListProps = {
  tickets: Ticket[];
  isLoading?: boolean;
  error?: string | null;
};