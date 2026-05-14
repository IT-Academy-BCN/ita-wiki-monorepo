import { useMemo, useState } from "react";
import { Ranking } from "../types/league";
import { groupByLeague } from "../utils/leagueUtils";

export const useGlobalRanking = () => {
  const [globalRanking] = useState<Ranking[]>([]);

  const leagueGroups = useMemo(
    () => groupByLeague(globalRanking),
    [globalRanking],
  );

  return { globalRanking, leagueGroups };
};
