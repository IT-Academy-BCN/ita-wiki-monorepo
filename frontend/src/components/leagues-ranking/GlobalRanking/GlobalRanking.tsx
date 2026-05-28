import { useGlobalRanking } from "../../../hooks/useGlobalRanking";
import { useUser } from "../../../hooks/useUser";
import { AddLeaguePoints } from "../AddLeaguePoints/AddLeaguePoints";
import { LeagueList } from "../LeagueList/LeagueList";

export const GlobalRanking = () => {
  const { user } = useUser();
  const { globalRanking, fetchRanking } = useGlobalRanking();

  return (
    <section>
      <LeagueList standings={globalRanking} />
      {user?.role && user.role !== "student" && (
        <AddLeaguePoints users={globalRanking} onPointAdded={fetchRanking} />
      )}
    </section>
  );
};
