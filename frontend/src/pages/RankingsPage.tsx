import { useEffect, useState } from "react";
import Container from "../components/ui/Container";
import { getLeagueRanking } from "../services/leagueService";
import { StandingsTable } from "../components/leagues/StandingsTable";
import type { Standing } from "../types/league";

const RankingsPage = () => {
  const [standings, setStandings] = useState<Standing[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getLeagueRanking()
      .then((data) => {
        const sorted = [...data].sort((a, b) => b.points - a.points);

      const standings: Standing[] = sorted.map((item, index) => ({
        position: index + 1,
        username: `User_${item.user_id}`, // placeholder fins que backend enviï noms
        language: "Unknown", // placeholder
        points: item.points,
      }));

      setStandings(standings);
    })
      .catch((error) => {
        console.error("Error loading ranking:", error);
        setStandings(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <Container className="xl:!px-16 md:!px-10 sm:!py-12 !px-6 !py-6 !bg-transparent">
      <h1 className="text-2xl font-bold mb-6">Lliga General</h1>

      {isLoading && <p>Carregant...</p>}

      {!isLoading && !standings && (
        <p className="text-red-600">
          No s'ha pogut carregar el rànquing. Torna-ho a provar més tard.
        </p>
      )}

      {!isLoading && standings && <StandingsTable standings={standings} />}
    </Container>
  );
};

export default RankingsPage;
