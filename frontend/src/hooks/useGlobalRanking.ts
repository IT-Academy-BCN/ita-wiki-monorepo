import { useEffect, useState } from "react";
import { fetchGlobalRanking } from "../api/endPointLeagues";
import { Liga } from "../types/league";

export const useGlobalRanking = () => {
  const [globalRanking, setGlobalRanking] = useState<Liga[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchRanking = async (): Promise<void> => {
      try {
        const ranking = await fetchGlobalRanking(controller.signal);
        setGlobalRanking(ranking);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        console.log(err instanceof Error ? err.message : "Unknown error");
      }
    };

    fetchRanking();
    return () => controller.abort();
  }, []);

  return { globalRanking };
};
