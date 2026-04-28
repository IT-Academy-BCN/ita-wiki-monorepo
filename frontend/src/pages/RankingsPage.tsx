import { useEffect, useState } from "react";
import LeagueToggle, {
  LeagueView,
} from "../components/LeagueToggle/LeagueToggle";
import { StandingsEmptyState } from "../components/leagues/StandingsEmptyState";
import { StandingsTable } from "../components/leagues/StandingsTable";
import { StandingsTableSkeleton } from "../components/leagues/StandingsTableSkeleton";
import Container from "../components/ui/Container";
import { getLeagueRanking } from "../services/leagueService";
import type { Liga, Standing } from "../types/league";

const toStanding = (liga: Liga): Standing => ({
  position: liga.position,
  user_id: liga.user_id,
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

  const standings: Standing[] = data.map(toStanding);

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
          <StandingsTable standings={standings} />
        )}
      </div>
    </Container>
  );
};

export default RankingsPage;
