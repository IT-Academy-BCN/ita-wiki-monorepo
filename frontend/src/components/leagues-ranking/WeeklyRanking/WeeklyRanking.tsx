import { useGlobalRanking } from "../../../hooks/useGlobalRanking";
import { LeagueList } from "../LeagueList/LeagueList";

export const WeeklyRanking = () => {
  const { leagueGroups } = useGlobalRanking();
  const LEAGUE_LABELS: Record<string, string> = {
    "1": "Or",
    "2": "Plata",
    "3": "Bronze",
  };

  return (
    <section>
      {leagueGroups.map(([id, league]) => (
        <div key={id} className="my-10">
          <h1>Lliga {LEAGUE_LABELS[id] ?? id}</h1>
          <LeagueList standings={league} />
        </div>
      ))}
    </section>
  );
};
