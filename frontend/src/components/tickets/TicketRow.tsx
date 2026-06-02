import { useState } from "react";
import type {
  ApiTicketData,
  TicketStatus,
  TicketPriority,
} from "../../types/ticketingTypes";
import { useTicketingUpdate } from "../../hooks/useTicketingUpdate";
import { useUserContext } from "../../context/UserContext";
import { roles } from "../../data/tempRoles";
import DropdownMenu from "../atoms/DropdownMenu";
import {
  STATUS_LABELS,
  STATUS_OPTIONS,
  PRIORITY_LABELS,
  PRIORITY_OPTIONS,
} from "./ticketConstants";

const formatDate = (date: string) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

interface TicketRowProps {
  ticket: ApiTicketData;
}

const TicketRow = ({ ticket }: TicketRowProps) => {
  const { updateStatus, updatePriority, isLoading } = useTicketingUpdate();
  const { user } = useUserContext();
  const isAdmin = user?.role === roles.ADMIN || user?.role === roles.SUPERADMIN;

  const [currentStatus, setCurrentStatus] = useState<TicketStatus>(
    ticket.status,
  );
  const [currentPriority, setCurrentPriority] = useState<TicketPriority>(
    ticket.priority ?? "low",
  );

  return (
    <div
      role="row"
      className="grid grid-cols-2 sm:grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] gap-2 sm:gap-4 px-4 py-4 border-b border-border/60 hover:bg-background/60"
    >
      <div role="cell" className="font-semibold">
        {String(ticket.id).padStart(6, "0")}
      </div>
      <div role="cell" className="truncate">
        {ticket.name}
      </div>
      <div role="cell">
        <DropdownMenu
          currentValue={STATUS_LABELS[currentStatus]}
          options={STATUS_OPTIONS}
          onSelect={async (value) => {
            const success = await updateStatus(
              ticket.id,
              value as TicketStatus,
            );
            if (success) setCurrentStatus(value as TicketStatus);
          }}
          disabled={isLoading || !isAdmin}
        />
      </div>
      <div role="cell">
        <DropdownMenu
          currentValue={PRIORITY_LABELS[currentPriority]}
          options={PRIORITY_OPTIONS}
          onSelect={async (value) => {
            const success = await updatePriority(
              ticket.id,
              value as TicketPriority,
            );
            if (success) setCurrentPriority(value as TicketPriority);
          }}
          disabled={isLoading || !isAdmin}
        />
      </div>
      <div role="cell">{formatDate(ticket.incident_date)}</div>
      <div role="cell">{ticket.code_connect?.role ?? "-"}</div>
    </div>
  );
};

export default TicketRow;
