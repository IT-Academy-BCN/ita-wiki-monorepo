import { useEffect, useState } from "react";
import { getLeagueRanking } from "../../../services/leagueService";
import type { Ranking } from "../../../types/league";
import { LeagueList } from "../LeagueList/LeagueList";

export const WeeklyRanking = () => {
  const [data, setData] = useState<
    [string, Omit<Ranking, "points_weekly">[]][]
  >([]);
  useEffect(() => {
    getLeagueRanking()
      .then(setData)
      .catch(() => { });
  }, []);
  const LEAGUE_LABELS: Record<string, string> = {
    "1": "Or",
    "2": "Plata",
    "3": "Bronze",
  };

  return (
    <section>
      {data.map(([id, league]) => (
        <div key={id} className="my-10">
          <h1>Lliga {LEAGUE_LABELS[id] ?? { id }}</h1>
          <LeagueList standings={league} />
        </div>
      ))}
    </section>
  );
};
