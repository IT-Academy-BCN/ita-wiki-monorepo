// components/ticketing/ticketingConstants.ts
import type {
  TicketStatus,
  TicketPriority,
  TicketCategoryEnum,
} from "../../types/ticketingTypes";

export const STATUS_LABELS: Record<TicketStatus, string> = {
  pending: "Nou",
  in_progress: "En progrés",
  blocked: "Bloquejat",
  ready: "Fet",
  closed: "Tancat",
};

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  low: "Baixa",
  medium: "Mitjana",
  high: "Alta",
  critical: "Crítica",
};

export const PRIORITY_COLORS: Record<TicketPriority, string> = {
  low: "text-emerald-600",
  medium: "text-amber-600",
  high: "text-orange-600",
  critical: "text-red-600",
};

export const CATEGORY_LABELS: Record<TicketCategoryEnum, string> = {
  bug: "Error",
  suggestion: "Suggeriment",
  other: "Altre",
};

export const STATUS_OPTIONS = (
  Object.keys(STATUS_LABELS) as TicketStatus[]
).map((value) => ({ value, label: STATUS_LABELS[value] }));

export const PRIORITY_OPTIONS = (
  Object.keys(PRIORITY_LABELS) as TicketPriority[]
).map((value) => ({ value, label: PRIORITY_LABELS[value] }));

export const CATEGORY_OPTIONS = (
  Object.keys(CATEGORY_LABELS) as TicketCategoryEnum[]
).map((value) => ({ value, label: CATEGORY_LABELS[value] }));

export const CATEGORY_ICONS = {
  bug: "ticketing-category-error-icon.svg",
  suggestion: "ticketing-category-suggeriment-icon.svg",
  other: "ticketing-category-altre-icon.svg",
};
