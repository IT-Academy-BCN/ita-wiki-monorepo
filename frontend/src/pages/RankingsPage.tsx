import { useEffect, useState } from "react";
import Container from "../components/ui/Container";
import { getLeagueRanking } from "../services/leagueService";
import { StandingsTable } from "../components/leagues/StandingsTable";
import type { Standing } from "../types/league";


const RankingsPage = () => {
  const [standings, setStandings] = useState<Standing[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getLeagueRanking().then((data) => {
      const league = data.leagues[0];
      setStandings(league.standings);
      setIsLoading(false);
    });
  }, []);
 return (
  <Container className="xl:!px-16 md:!px-10 sm:!py-12 !px-6 !py-6">
    <h1 className="text-2xl font-bold mb-6">Lliga General</h1>

    {isLoading && <p>Carregant...</p>}

    {!isLoading && standings && (
      <StandingsTable standings={standings} />
    )}
  </Container>
);

};

export default RankingsPage;
