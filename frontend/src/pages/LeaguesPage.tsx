import { useState } from "react";
import LeagueToggle, {
  LeagueView,
} from "../components/leagues-ranking/LeagueToggle/LeagueToggle";
import { GlobalRanking } from "../components/leagues-ranking/GlobalRanking/GlobalRanking";
import { WeeklyRanking } from "../components/leagues-ranking/WeeklyRanking/WeeklyRanking";
import { useUser } from "../hooks/useUser";
import rotateIcon from "../assets/rotate.svg";
import UiButton from "../components/ui/shared-ui/UiButton";
import GenericModal from "../components/ui/Modal/GenericModal";

const LeaguesPage = () => {
  const [view, setView] = useState<LeagueView>("weekly");
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTriggerModalOpen, setIsTriggerModalOpen] = useState(false);
  const handleTriggerClick = () => {setIsTriggerModalOpen(true)};
  
  return (
    <div className="px-6 md:px-10 xl:px-20 2xl:px-6 flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between w-full">
          <LeagueToggle view={view} onChange={setView} />
        </div>
        <div className="flex flex-col gap-1">
          <UiButton
            variant="link"
            size="sm"
            onClick={() => setIsModalOpen(true)}
          >
            Veure el meu historial
          </UiButton>
          
          {user?.role && user.role !== "student" && (
          <button
            onClick={handleTriggerClick}
            className="bg-primary p-1 rounded-md hover:bg-[#a1156a] cursor-pointer">
            <img
              src={rotateIcon}
              alt="Trigger weekly transition"
              className="w-7 h-7"
            />
          </button>
            )}
      </div>
      </div>
      {view === "weekly" ? <WeeklyRanking /> : <GlobalRanking />}

      <GenericModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="El meu historial de punts"
        size="lg"
      />

      <GenericModal
        isOpen={isTriggerModalOpen}
        onClose={() => setIsTriggerModalOpen(false)}
        title="Actualitzar lligues"
        showPrimaryButton
        primaryButtonText="Confirmar"
        primaryButtonAction={() => setIsTriggerModalOpen(false)}
        showSecondaryButton
        secondaryButtonText="Cancel·lar"
        secondaryButtonAction={() => setIsTriggerModalOpen(false)}
      >
        <p>Vols actualitzar les lligues?</p>
      </GenericModal>
    </div>
  );
};

export default LeaguesPage;
