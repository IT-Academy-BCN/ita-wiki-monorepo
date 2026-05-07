import { useEffect, useState } from "react";
import { StandingsTable } from "../components/rankings/leagues/StandingsTable";
import { getLeagueRanking } from "../services/leagueService";
import type { Liga } from "../types/league";

const RankingsPage = () => {
  const [data, setData] = useState<Liga[]>([]);

  useEffect(() => {
    getLeagueRanking()
      .then(setData)
      .catch(() => {});
  }, []);

  return <StandingsTable standings={data} />;
};

export default RankingsPage;
