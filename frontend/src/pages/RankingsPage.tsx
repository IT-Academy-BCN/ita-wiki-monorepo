import { useEffect, useState } from "react";
import LeaderCard, {
  CupType,
} from "../components/LeaderCard/LeaderCard";
import {
  LeagueToggle,
  LeagueView,
} from "../components/LeagueToggle/LeagueToggle";
import { StandingsEmptyState } from "../components/leagues/StandingsEmptyState";
import { StandingsTable } from "../components/leagues/StandingsTable";
import { StandingsTableSkeleton } from "../components/leagues/StandingsTableSkeleton";
import Container from "../components/ui/Container";
import { getLeagueRanking } from "../services/leagueService";
import type { Liga, Standing } from "../types/league";

const cupOrder: CupType[] = ["gold", "silver", "bronze"];

const toStanding = (liga: Liga): Standing => ({
  username: `User ${liga.user_id}`,
  language: "—",
  points: liga.points,
});

const RankingsPage = () => {
  const [view, setView] = useState<LeagueView>("global");
  const [data, setData] = useState<Liga[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getLeagueRanking();
      setData(result);
    } catch {
      setError("No s'han pogut carregar les dades. Torna-ho a intentar.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [view]);

  const top3 = data.slice(0, 3);
  const rest = data.slice(3);
  const standings: Standing[] = rest.map(toStanding);

  return (
    <Container className="xl:!px-16 md:!px-10 sm:!py-12 !px-6 !py-6">
      <div className="flex flex-col gap-8">
        <div className="flex justify-center">
          <LeagueToggle view={view} onChange={setView} />
        </div>

        {isLoading && <StandingsTableSkeleton />}

        {!isLoading && error && (
          <div className="flex flex-col items-center gap-4 py-12" role="alert">
            <p className="text-gray-600">{error}</p>
            <button
              onClick={fetchData}
              className="px-6 py-2 bg-[#B91879] text-white rounded-md font-semibold hover:opacity-90 transition"
            >
              Torna-ho a intentar
            </button>
          </div>
        )}

        {!isLoading && !error && data.length === 0 && <StandingsEmptyState />}

        {!isLoading && !error && data.length > 0 && (
          <>
            <div className="flex justify-center gap-6 flex-wrap">
              {top3.map((liga, index) => (
                <LeaderCard
                  key={liga.id}
                  cupType={cupOrder[index]}
                  player={{
                    user_id: liga.user_id,
                    username: `User ${liga.user_id}`,
                    avatarUrl: "",
                    title: "—",
                    points: liga.points,
                  }}
                />
              ))}
            </div>

            {standings.length > 0 ? (
              <StandingsTable standings={standings} />
            ) : (
              <StandingsEmptyState />
            )}
          </>
        )}
      </div>
    </Container>
  );
};

export default RankingsPage;
