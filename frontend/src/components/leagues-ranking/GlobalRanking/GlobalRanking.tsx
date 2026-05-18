import { useEffect, useState } from "react";
import { getLeagueRanking } from "../../../services/leagueService";
import type { Ranking } from "../../../types/league";
import { AddLeaguePoints } from "../AddLeaguePoints/AddLeaguePoints";
import { LeagueList } from "../LeagueList/LeagueList";

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
      <AddLeaguePoints />
    </section>
  );
};
