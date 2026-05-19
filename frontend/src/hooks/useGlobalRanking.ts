import { useEffect, useMemo, useState } from "react";
import { fetchGlobalRanking } from "../api/endPointLeagues";
import type { Ranking } from "../types/league";
import { groupByLeague } from "../utils/leagueUtils";

export const useGlobalRanking = () => {
  const [globalRanking, setGlobalRanking] = useState<Ranking[]>([]);

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

  const leagueGroups = useMemo(
    () => groupByLeague(globalRanking),
    [globalRanking],
  );

  return { globalRanking, leagueGroups };
};
