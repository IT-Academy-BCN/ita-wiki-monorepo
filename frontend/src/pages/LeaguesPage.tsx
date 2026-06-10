import { useState } from "react";
import LeagueToggle, {
  LeagueView,
} from "../components/leagues-ranking/LeagueToggle/LeagueToggle";
import { GlobalRanking } from "../components/leagues-ranking/GlobalRanking/GlobalRanking";
import { WeeklyRanking } from "../components/leagues-ranking/WeeklyRanking/WeeklyRanking";
import UiButton from "../components/ui/shared-ui/UiButton";
import GenericModal from "../components/ui/Modal/GenericModal";
import PointsHistoryTable from "../components/leagues-ranking/PointsHistoryTable/pointshistorytable";

const LeaguesPage = () => {
  const [view, setView] = useState<LeagueView>("weekly");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="px-6 md:px-10 xl:px-20 2xl:px-6 flex flex-col gap-10">
      <div className="flex items-center justify-between w-full">
        <LeagueToggle view={view} onChange={setView} />
        <UiButton variant="link" size="sm" onClick={() => setIsModalOpen(true)}>
          Veure el meu historial
        </UiButton>
      </div>
        <div className="flex flex-col items-end gap-1">
          <UiButton variant="link" size="sm" onClick={() => {}}>
            Veure el meu historial
          </UiButton>
          <button onClick={() => setIsModalOpen(true)}>Trigger</button>
        </div>
      </div>
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

      <GenericModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="El meu historial de punts"
        size="lg"
      >
        <PointsHistoryTable />
      </GenericModal>
    </div>
  );
};

export default LeaguesPage;
