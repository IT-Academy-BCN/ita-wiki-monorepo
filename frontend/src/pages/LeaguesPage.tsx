import { useState } from "react";
import LeagueToggle, {
  LeagueView,
} from "../components/leagues-ranking/LeagueToggle/LeagueToggle";
import { GlobalRanking } from "../components/leagues-ranking/GlobalRanking/GlobalRanking";
import { WeeklyRanking } from "../components/leagues-ranking/WeeklyRanking/WeeklyRanking";
import GenericModal from "../components/ui/Modal/GenericModal";

const LeaguesPage = () => {
  const [view, setView] = useState<LeagueView>("weekly");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="px-6 md:px-10 xl:px-20 2xl:px-6 flex flex-col gap-10">
      <LeagueToggle view={view} onChange={setView} />
      <button onClick={() => setIsModalOpen(true)}>Trigger</button>
      <GenericModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Actualitzar lligues"
        showPrimaryButton
        primaryButtonText="Confirmar"
        primaryButtonAction={() => setIsModalOpen(false)}
        showSecondaryButton
        secondaryButtonText="Cancel·lar"
        secondaryButtonAction={() => setIsModalOpen(false)}
      >
        <p>Vols actualitzar les lligues?</p>
      </GenericModal>

      {view === "weekly" ? <WeeklyRanking /> : <GlobalRanking />}
    </div>
  );
};

export default LeaguesPage;
