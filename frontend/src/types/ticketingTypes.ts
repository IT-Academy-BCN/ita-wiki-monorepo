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
}

export interface ApiTicketsResponse {
  success: boolean;
  data: ApiTicketData[];
  message?: string;
}

export interface TicketingError {
  message: string;
}

export interface UseTicketingGetAllState {
  tickets: ApiTicketData[];
  isLoading: boolean;
  errorMessage: string | null;
}
