export type Ticket = {
  id: number;
  name: string;
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