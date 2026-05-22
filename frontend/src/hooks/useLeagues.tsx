import { useEffect, useState } from "react";
import { fetchLeagueRanking } from "../api/endPointLeagues";
import type { LigaResponse } from "../types/league";

export const useLeagues = () => {
  const [leagues, setLeagues] = useState<LigaResponse | null>(null);

  useEffect(() => {
    const fetchLeagues = async (): Promise<void> => {
      try {
        const data = await fetchLeagueRanking();
        setLeagues(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        console.log(err instanceof Error ? err.message : "Unknown error");
      }
    };
    fetchLeagues();
  }, []);

  return { leagues };
};
