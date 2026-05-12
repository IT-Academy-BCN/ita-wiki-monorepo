import { useEffect, useState } from "react";
import { LeagueList } from "../components/leagues/LeagueList";
import { getLeagueRanking } from "../services/leagueService";
import type { Liga } from "../types/league";

const LeaguesPage = () => {
  const [data, setData] = useState<Liga[]>([]);

  useEffect(() => {
    getLeagueRanking()
      .then(setData)
      .catch(() => {});
  }, []);

  return <LeagueList standings={data} />;
};

export default LeaguesPage;
