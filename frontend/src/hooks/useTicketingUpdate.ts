import { useState } from "react";
import { updateTicket } from "../api/endPointTickets";
import type { TicketPriority, TicketStatus } from "../types/ticketingTypes";

export const useTicketingUpdate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updatePriority = async (
    ticketId: number,
    priority: TicketPriority,
  ): Promise<boolean> => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      await updateTicket(ticketId, { priority });
      return true;
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unknown error");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (
    ticketId: number,
    status: TicketStatus,
  ): Promise<boolean> => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      await updateTicket(ticketId, { status });
      return true;
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unknown error");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateStatus, updatePriority, isLoading, errorMessage };
};