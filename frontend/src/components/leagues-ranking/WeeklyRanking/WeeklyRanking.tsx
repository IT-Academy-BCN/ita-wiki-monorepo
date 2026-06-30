import type { LigaResponse } from "../../../types/league";
import { LeagueList } from "../LeagueList/LeagueList";

type WeeklyRankingProps = {
  leagues: LigaResponse | null;
};

export const WeeklyRanking = ({ leagues }: WeeklyRankingProps) => {
  const LEAGUE_LABELS: Record<string, string> = {
    "1": "Bronze",
    "2": "Plata",
    "3": "Or",
  };

  const sortedLeagues = leagues
    ? Object.entries(leagues).sort(([a], [b]) => Number(b) - Number(a))
    : [];

  return (
    <>
      {leagues && (
        <section>
          {sortedLeagues.map(([id, league], index) => (
            <div key={id} className="my-10">
              <h1>Lliga {LEAGUE_LABELS[id] ?? id}</h1>
              <LeagueList
                standings={league}
                showUp={index > 0}
                showDown={index + 1 < sortedLeagues.length}
              />
            </div>
          ))}
        </section>
      )}
    </>
  );
};
