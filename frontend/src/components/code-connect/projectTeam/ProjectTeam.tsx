import { useState } from "react";
import ProgressBar from "../../code-connect/projectCard/ProgressBar";
import ButtonComponent from "../../atoms/ButtonComponent";
import TeamRow from "./TeamRow";
import { useProjectContributors } from "../../../hooks/useProjectContributors";
import { ApiProjectContributor } from "../../../types/codeConnectTypes";
import { joinProject } from "../../../api/endPointContributors";
import GenericModal from "../../ui/Modal/GenericModal";

interface ProjectTeamProps {
  logoFront?: string;
  logoBack?: string;
  contributors?: ApiProjectContributor[];
  timeDuration?: string;
  projectId?: number;
}

function ProjectTeam({
  logoFront,
  logoBack,
  contributors = [],
  timeDuration,
  projectId,
}: ProjectTeamProps) {
  const { getTeamByRole } = useProjectContributors(contributors);
  const frontendData = getTeamByRole("frontend");
  const backendData = getTeamByRole("backend");
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(
    null,
  );
  const [selectedRole, setSelectedRole] = useState<
    "Frontend Developer" | "Backend Developer" | null
  >(null);

  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  const handleSlotClick = (
    role: "Frontend Developer" | "Backend Developer",
    index: number,
  ) => {
    setSelectedRole(role);
    setSelectedSlotIndex(index);
  };

  const handleJoin = async () => {
    if (!selectedRole || !projectId) return;
    await joinProject(projectId, selectedRole);
  };
  const frontendOffset = 0;
  const backendOffset = frontendData.emptySlots;

  const handleLeave = () => {
    //TODO: api call to leave project
  };

  return (
    <div className="flex flex-col items-start border border-gray-500 text-black w-80 pt-7 pb-10 px-6 rounded-3xl max-h-[700px]">
      <div>
        <h2 className="font-extrabold text-xl text-start">Equip</h2>
      </div>
      <div className="w-full mt-5">
        <div className="flex w-full items-center gap-4 mb-4">
          <h2 className="text-sm font-bold">Frontend</h2>
          {logoFront && (
            <img className="w-7" src={logoFront} alt="Logo Frontend" />
          )}
        </div>
        <TeamRow
          members={frontendData.members}
          emptySlots={frontendData.emptySlots}
          onSlotClick={(index) =>
            handleSlotClick("Frontend Developer", index + frontendOffset)
          }
          selectedSlotIndex={
            selectedRole === "Frontend Developer" ? selectedSlotIndex : null
          }
          slotIndexOffset={frontendOffset}
        />
        <div className="flex w-full items-center gap-4 mb-4">
          <h2 className="text-sm font-bold">Backend</h2>
          {logoBack && (
            <img className="w-7" src={logoBack} alt="Logo Backend" />
          )}
        </div>
        <div className="mb-14">
          <TeamRow
            members={backendData.members}
            emptySlots={backendData.emptySlots}
            onSlotClick={(index) =>
              handleSlotClick("Backend Developer", index + backendOffset)
            }
            selectedSlotIndex={
              selectedRole === "Backend Developer" ? selectedSlotIndex : null
            }
            slotIndexOffset={backendOffset}
          />
        </div>
      </div>
      <div className="w-full mb-14">
        <h2 className="font-extrabold text-xl text-start mb-4">
          Termini d'inscripció
        </h2>
        <ProgressBar
          title="Progrés del projecte"
          startDate="2025-10-01"
          endDate="2025-11-13"
        />
      </div>
      <div className="mb-10">
        <h2 className="font-extrabold text-xl text-start">Durada</h2>
        <p className="text-sm font-bold text-start">
          {timeDuration || "No especificada"}
        </p>
      </div>
      <div className="w-full">
        <ButtonComponent
          className="my-5 w-full"
          type="button"
          variant="primary"
          disabled={!selectedRole}
          onClick={handleJoin}
        >
          Apuntar-me
        </ButtonComponent>
      </div>
      <div className="w-full flex justify-center -mt-8 ">
        <ButtonComponent
          className="my-5 w-full"
          type="button"
          variant="discret"
          onClick={() => setIsLeaveModalOpen(true)}
        >
          deixar projecte
        </ButtonComponent>
      </div>

      {isLeaveModalOpen && (
        <GenericModal
          isOpen={isLeaveModalOpen}
          onClose={() => setIsLeaveModalOpen(false)}
          title="Deixar projecte"
          showPrimaryButton
          primaryButtonText="Confirmar"
          primaryButtonAction={() => setIsLeaveModalOpen(false)}
          showSecondaryButton
          secondaryButtonText="Cancel·lar"
          secondaryButtonAction={() => setIsLeaveModalOpen(false)}
        >
          <p>Segur que vols deixar aquest projecte?</p>
        </GenericModal>
      )}
    </div>
  );
}

export default ProjectTeam;
