import { useState } from "react";
import { GlobalRanking } from "../components/Leagues/GlobalRanking/GlobalRanking";
import LeagueToggle, {
  LeagueView,
} from "../components/Leagues/LeagueToggle/LeagueToggle";
import { WeeklyRanking } from "../components/Leagues/WeeklyRanking/WeeklyRanking";

const LeaguesPage = () => {
  const [view, setView] = useState<LeagueView>("weekly");

  return (
    <div className="px-6 md:px-10 xl:px-20 2xl:px-6 flex flex-col gap-10">
      <LeagueToggle view={view} onChange={setView} />
      {view === "weekly" ? <WeeklyRanking /> : <GlobalRanking />}
    </div>
  );
};

export default LeaguesPage;
