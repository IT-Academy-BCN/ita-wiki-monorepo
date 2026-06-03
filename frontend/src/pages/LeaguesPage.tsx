import { useState } from "react";
import LeagueToggle, {
  LeagueView,
} from "../components/leagues-ranking/LeagueToggle/LeagueToggle";
import { GlobalRanking } from "../components/leagues-ranking/GlobalRanking/GlobalRanking";
import { WeeklyRanking } from "../components/leagues-ranking/WeeklyRanking/WeeklyRanking";
import UiButton from "../components/ui/shared-ui/UiButton";

const LeaguesPage = () => {
  const [view, setView] = useState<LeagueView>("weekly");

  return (
    <div className="px-6 md:px-10 xl:px-20 2xl:px-6 flex flex-col gap-10">
      <div className="flex items-center justify-between w-full">
        <LeagueToggle view={view} onChange={setView} />
        <UiButton variant="link" size="sm" onClick={() => {}}>
          Veure el meu historial
        </UiButton>
      </div>
      {view === "weekly" ? <WeeklyRanking /> : <GlobalRanking />}
    </div>
  );
};

export default LeaguesPage;
