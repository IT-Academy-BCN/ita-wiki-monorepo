import { useEffect, useState } from "react";
import { getLeagueRanking } from "../../../services/leagueService";
import type { Liga } from "../../../types/league";
import { LeagueList } from "../LeagueList/LeagueList";
import { AddLeaguePoints } from "../AddLeaguePoints/AddLeaguePoints";

export const GlobalRanking = () => {
  const [data, setData] = useState<Liga[]>([]);

  useEffect(() => {
    getLeagueRanking()
      .then(setData)
      .catch(() => {});
  }, []);

  return (
    <section>
      <LeagueList standings={data} />
      <AddLeaguePoints />
    </section>
  );
};
