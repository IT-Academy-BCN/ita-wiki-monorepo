import { useCallback, useEffect, useState } from "react";

import { addComment, getComments } from "../api/endPointTickets";
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
        setError("Error en carregar els comentaris");
      } finally {
        setIsLoading(false);
      }
    };

    if (!ticketId) return;
    fetchComments();
  }, [ticketId]);

  const submitComment = useCallback(
    async (comment: string) => {
      try {
        await addComment(ticketId, comment);
      } catch {
        setError("Error en enviar el comentari");
      }
    },
    [ticketId],
  );

  return { comments, isLoading, error, submitComment };
};
