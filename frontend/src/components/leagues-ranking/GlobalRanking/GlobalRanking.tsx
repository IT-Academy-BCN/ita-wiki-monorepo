import { useGlobalRanking } from "../../../hooks/useGlobalRanking";
import { AddLeaguePoints } from "../AddLeaguePoints/AddLeaguePoints";
import { LeagueList } from "../LeagueList/LeagueList";

export const GlobalRanking = () => {
  const { globalRanking } = useGlobalRanking();

  return (
    <section>
      <LeagueList standings={globalRanking} />
      <AddLeaguePoints />
    </section>
  );
};
