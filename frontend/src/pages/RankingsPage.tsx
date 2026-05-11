import { useState } from "react";
import { GlobalRanking } from "../components/GlobalRanking/GlobalRanking";
import LeagueToggle, {
  LeagueView,
} from "../components/LeagueToggle/LeagueToggle";
import { WeeklyRanking } from "../components/WeeklyRanking/WeeklyRanking";

const RankingsPage = () => {
  const [view, setView] = useState<LeagueView>("weekly");

  return (
    <div className="px-6 md:px-10 xl:px-20 2xl:px-6 flex flex-col gap-10">
      <LeagueToggle view={view} onChange={setView} />
      {view === "weekly" ? <WeeklyRanking /> : <GlobalRanking />}
    </div>
  );
};

export default RankingsPage;
