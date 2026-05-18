import { useEffect, useState } from "react";

import { getLeagueRanking } from "../../../services/leagueService";

import { LeagueList } from "../LeagueList/LeagueList";
import type { Ranking } from "../../../types/league";
import { AddLeaguePoints } from "../AddLeaguePoints/AddLeaguePoints";

export const GlobalRanking = () => {
  const [data, setData] = useState<Omit<Ranking, "league_id">[]>([]);

  useEffect(() => {
    getLeagueRanking()
      .then(setData)
      .catch(() => {});
  }, []);

  return (
    <section>
      <LeagueList standings={data} />
      <AddLeaguePoints users={data} />
    </section>
  );
};
