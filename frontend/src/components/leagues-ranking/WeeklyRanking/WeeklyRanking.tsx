import { useLeagues } from "../../../hooks/useLeagues";
import { LeagueList } from "../LeagueList/LeagueList";

export const WeeklyRanking = () => {
  const { leagues } = useLeagues();
  const LEAGUE_LABELS: Record<string, string> = {
    "1": "Or",
    "2": "Plata",
    "3": "Bronze",
  };

  return (
    <>
      {leagues && (
        <section>
          {Object.entries(leagues).map(([id, league], index) => (
            <div key={id} className="my-10">
              <h1>Lliga {LEAGUE_LABELS[id] ?? id}</h1>
              <LeagueList
                standings={league}
                showUp={index > 0}
                showDown={index + 1 < Object.entries(leagues).length}
              />
            </div>
          ))}
        </section>
      )}
    </>
  );
};
