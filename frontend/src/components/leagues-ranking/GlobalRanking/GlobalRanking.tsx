import { useGlobalRanking } from "../../../hooks/useGlobalRanking";
import { AddLeaguePoints } from "../AddLeaguePoints/AddLeaguePoints";
import { LeagueList } from "../LeagueList/LeagueList";

export const GlobalRanking = () => {
  const { globalRanking, user } = useGlobalRanking();

  return (
    <section>
      <LeagueList standings={globalRanking} user={user} />
      <AddLeaguePoints users={globalRanking} />
    </section>
  );
};
