import { useEffect, useState } from "react";
import Container from "../components/ui/Container";
import { getLeagueRanking } from "../services/leagueService";
import { StandingsTable } from "../components/leagues/StandingsTable";
import LeaderCard, { type CupType } from "../components/LeaderCard/LeaderCard";
import LeagueToggle, { type LeagueView } from "../components/LeagueToggle/LeagueToggle";
import type { Liga } from "../types/league";
const CUPS: CupType[] = ["gold", "silver", "bronze"];
const TITLES = ["Expert Hacker", "Skilled Developer", "Junior Coder"];
const RankingsPage = () => {
  const [ligas, setLigas] = useState<Liga[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<LeagueView>("global");
  useEffect(() => { getLeagueRanking().then(setLigas).catch(() => setLigas(null)).finally(() => setIsLoading(false)); }, []);
  return (
    <Container className="xl:!px-16 md:!px-10 sm:!py-12 !px-6 !py-6 !bg-transparent">
      <div className="flex items-center justify-between gap-4 mb-6"><LeagueToggle view={view} onChange={setView} /></div>
      {isLoading && <p>Carregant...</p>}
      {!isLoading && !ligas && <p className="text-red-600">No s'ha pogut carregar el rànquing.</p>}
      {!isLoading && ligas && <>
        <h2 className="text-base font-semibold mb-3">Liga Oro</h2>
        <div className="flex gap-4 mb-4">{ligas.slice(0, 3).map((l, i) => <LeaderCard key={l.user_id} cupType={CUPS[i]} player={{ user_id: l.user_id, username: `User_${l.user_id}`, avatarUrl: "", title: TITLES[i], points: l.points }} />)}</div>
        <StandingsTable ligas={ligas.slice(3)} />
        <h2 className="text-base font-semibold mt-6 mb-3">Liga Plata</h2>
        <StandingsTable ligas={ligas} highlighted />
      </>}
    </Container>
  );
};
export default RankingsPage;
