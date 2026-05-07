import { useEffect, useState } from "react";
import { StandingsTable } from "../components/Leagues/StandingsTable/StandingsTable";
import { getLeagueRanking } from "../services/leagueService";
import type { Liga } from "../types/league";

const LeaguesPage = () => {
  const [data, setData] = useState<Liga[]>([]);

  useEffect(() => {
    getLeagueRanking()
      .then(setData)
      .catch(() => {});
  }, []);

  return <StandingsTable standings={data} />;
};

export default LeaguesPage;
