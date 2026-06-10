import { useState } from "react";
import LeagueToggle, {
  LeagueView,
} from "../components/leagues-ranking/LeagueToggle/LeagueToggle";
import { GlobalRanking } from "../components/leagues-ranking/GlobalRanking/GlobalRanking";
import { WeeklyRanking } from "../components/leagues-ranking/WeeklyRanking/WeeklyRanking";
import { useUser } from "../hooks/useUser";
import rotateIcon from "../assets/rotate.svg";
import GenericModal from "../components/ui/Modal/GenericModal";

const LeaguesPage = () => {
  const [view, setView] = useState<LeagueView>("weekly");
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleTriggerClick = () => {setIsModalOpen(true)};

  return (
    <div className="px-6 md:px-10 xl:px-20 2xl:px-6 flex flex-col gap-10">
      <LeagueToggle view={view} onChange={setView} />
      {user?.role && user.role !== "student" && (
        <div className="flex justify-end">
          <button
            onClick={handleTriggerClick}
            className="bg-primary p-1 rounded-md hover:bg-[#a1156a] cursor-pointer">
            <img
              src={rotateIcon}
              alt="Trigger weekly transition"
              className="w-7 h-7"
            />
          </button>
        </div>
      )}
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
