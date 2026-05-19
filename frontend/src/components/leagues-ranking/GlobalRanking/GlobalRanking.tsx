import { useGlobalRanking } from "../../../hooks/useGlobalRanking";
import { AddLeaguePoints } from "../AddLeaguePoints/AddLeaguePoints";

export const GlobalRanking = () => {
  const { globalRanking } = useGlobalRanking();

  return (
    <section>
      <LeagueList standings={globalRanking} />
      <AddLeaguePoints />
    </section>
  );
};
