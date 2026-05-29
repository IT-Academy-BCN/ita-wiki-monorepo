import { useEffect, useState } from "react";

import { getComments } from "../api/endPointTickets";
import type { TicketComment } from "../types/ticketingTypes";

export const useTicketComments = (ticketId: number) => {
  const [comments, setComments] = useState<TicketComment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const data = await getComments(ticketId);
        setComments(data);
      } catch {
        setError("Error loading comments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [ticketId]);

  return { comments, isLoading, error };
};
