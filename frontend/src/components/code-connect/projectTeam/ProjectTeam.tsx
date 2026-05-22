import { useState } from "react";
import ProgressBar from "../../code-connect/projectCard/ProgressBar";
import ButtonComponent from "../../atoms/ButtonComponent";
import TeamRow from "./TeamRow";
import { useProjectContributors } from "../../../hooks/useProjectContributors";
import { ApiProjectContributor } from "../../../types/codeConnectTypes";
import { joinProject } from "../../../api/endPointJoinProject";

interface ProjectTeamProps {
  logoFront?: string;
  logoBack?: string;
  contributors?: ApiProjectContributor[];
  timeDuration?: string;
  projectId: number;
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
  const [selectedRole, setSelectedRole] = useState<
    "Frontend Developer" | "Backend Developer" | null
  >(null);

  const handleJoin = async () => {
    if (!selectedRole) return;
    await joinProject(projectId, selectedRole);
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
          onSlotClick={() => setSelectedRole("Frontend Developer")}
          isSelected={selectedRole === "Frontend Developer"}
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
            onSlotClick={() => setSelectedRole("Backend Developer")}
            isSelected={selectedRole === "Backend Developer"}
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
          onClick={handleJoin}
          disabled={!selectedRole}
        >
          Apuntar-me
        </ButtonComponent>
      </div>
    </div>
  );
}

export default ProjectTeam;
