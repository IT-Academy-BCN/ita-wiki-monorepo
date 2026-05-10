import { useEffect, useState } from "react";
import { fetchGlobalRanking } from "../api/endPointLeagues";
import { Liga } from "../types/league";

export const useGlobalRanking = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [globalRanking, setGlobalRanking] = useState<Liga[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchRanking = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);
      try {
        const ranking = await fetchGlobalRanking(controller.signal);
        setGlobalRanking(ranking);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRanking();
    return () => controller.abort();
  }, []);

  return { globalRanking, isLoading, error };
};
