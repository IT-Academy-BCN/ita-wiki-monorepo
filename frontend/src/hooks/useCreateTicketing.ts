import { useState } from "react";
import { createTicket } from "../api/endPointTickets";
import { IntCreateTicket, IntTicket } from "../types/ticketingTypes";

export const useCreateTicketing = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [ticketing, setTicketing] = useState<IntTicket[]>([]);

  const submitTicketing = async (
    ticketData: IntCreateTicket,
  ): Promise<IntTicket> => {
    setIsLoading(true);
    setError(null);

    try {
      const newTicketing = await createTicket(ticketData);
      setTicketing((prev) => [...prev, newTicketing]);
      return newTicketing;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { submitTicketing, isLoading, error, ticketing };
};
