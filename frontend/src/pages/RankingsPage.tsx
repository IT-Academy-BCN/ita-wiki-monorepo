import { useEffect, useState } from "react";
import Container from "../components/ui/Container";
import { getLeagueRanking } from "../services/leagueService";
import { StandingsTable } from "../components/leagues/StandingsTable";

const RankingsPage = () => {
  const [standings, setStandings] = useState<
    { position: number; username: string; points: number }[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getLeagueRanking()
      .then((data) => {
        const sorted = [...data].sort((a, b) => b.points - a.points);

        const mappedStandings = sorted.map((item, index) => ({
          position: index + 1,
          username: `User_${item.user_id}`,
          points: item.points,
        }));

        setStandings(mappedStandings);
      })
      .catch((error) => {
        console.error("Error loading ranking:", error);
        setStandings([]);
      })

      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <Container className="xl:!px-16 md:!px-10 sm:!py-12 !px-6 !py-6 !bg-transparent">
      <h1 className="text-2xl font-bold mb-6">Lliga General</h1>

      {isLoading && <p>Carregant...</p>}

      {!isLoading && standings.length === 0 && (
        <p className="text-red-600">
          No s'ha pogut carregar el rànquing. Torna-ho a provar més tard.
        </p>
      )}

      {!isLoading && standings && <StandingsTable standings={standings} />}
    </Container>
  );
};

export default RankingsPage;
