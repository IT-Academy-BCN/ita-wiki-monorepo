import { useEffect, useMemo, useState } from "react";
import { fetchGlobalRanking } from "../api/endPointLeagues";
import { useUserContext } from "../context/UserContext";
import type { Ranking } from "../types/league";
import { groupByLeague } from "../utils/leagueUtils";

export const useGlobalRanking = () => {
  const { user, setUser } = useUserContext();
  const [globalRanking, setGlobalRanking] = useState<Ranking[]>([]);
  useEffect(() => {
    if (user) setUser({ ...user, id: 8 });
  }, []);

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

  return { globalRanking, leagueGroups, user };
};
