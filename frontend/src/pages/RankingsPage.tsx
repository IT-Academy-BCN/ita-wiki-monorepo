import { useEffect, useState } from "react";
import Container from "../components/ui/Container";
import { getLeagueRanking } from "../services/leagueService";
import { StandingsTable } from "../components/leagues/StandingsTable";
import LeaderCard, { type CupType } from "../components/LeaderCard/LeaderCard";
import LeagueToggle, { type LeagueView } from "../components/LeagueToggle/LeagueToggle";
import type { Standing } from "../types/league";

const CUPS: CupType[] = ["gold", "silver", "bronze"];
const STATUSES = ["Expert Hacker", "Skilled Developer", "Junior Coder", "Expert Hacker", "Junior Coder", "Junior Coder", "Expert Hacker", "Junior Coder", "Junior Coder", "Expert Hacker"];

const RankingsPage = () => {
  const [standings, setStandings] = useState<Standing[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<LeagueView>("global");

  useEffect(() => {
    getLeagueRanking()
      .then((data) => setStandings([...data].sort((a, b) => b.points - a.points).map((item, i) => ({
        position: i + 1, username: `User_${item.user_id}`, status: STATUSES[i] ?? "Junior Coder", points: item.points,
      }))))
      .catch(() => setStandings(null))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <Container className="xl:!px-16 md:!px-10 sm:!py-12 !px-6 !py-6 !bg-transparent">
      <div className="flex items-center justify-between gap-4 mb-6">
        <LeagueToggle view={view} onChange={setView} />
      </div>
      {isLoading && <p>Carregant...</p>}
      {!isLoading && !standings && <p className="text-red-600">No s'ha pogut carregar el rànquing.</p>}
      {!isLoading && standings && (<>
        <h2 className="text-base font-semibold mb-3">Liga Oro</h2>
        <div className="flex gap-4 mb-4">
          {standings.slice(0, 3).map((p, i) => (
            <LeaderCard key={p.username} cupType={CUPS[i]} player={{ user_id: i + 1, username: p.username, avatarUrl: "", title: STATUSES[i], points: p.points }} />
          ))}
        </div>
        <StandingsTable standings={standings.slice(3)} startPosition={4} />
        <h2 className="text-base font-semibold mt-6 mb-3">Liga Plata</h2>
        <StandingsTable standings={standings} highlighted />
      </>)}
    </Container>
  );
};

export default RankingsPage;
