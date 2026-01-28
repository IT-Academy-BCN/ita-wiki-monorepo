import ProgressBar from "../../code-connect/projectCard/ProgressBar";
import ButtonComponent from "../../atoms/ButtonComponent";
import TeamRow from "./TeamRow";
import { useProjectTeam } from "../../../hooks/useProjectTeam";
import { CodeConnectProjectDataContributor } from "../../../types/CodeConnectProject";

interface ProjectTeamProps {
  logoFront?: string;
  logoBack?: string;
  contributors?: CodeConnectProjectDataContributor[];
  timeDuration?: string;
}

function ProjectTeam({
  logoFront,
  logoBack,
  contributors = [],
  timeDuration
}: ProjectTeamProps) {

  const { getTeamByRole } = useProjectTeam(contributors);

  const frontendData = getTeamByRole("frontend");
  const backendData = getTeamByRole("backend");

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
          />
        </div>
      </div>

      <div className="w-full mb-14">
        <h2 className="font-extrabold text-xl text-start mb-4">
          Termini d’inscripció
        </h2>
        <ProgressBar
          title="Progrés del projecte"
          startDate="2025-10-01"
          endDate="2025-11-13"
        />
      </div>

      <div className="mb-10">
        <h2 className="font-extrabold text-xl text-start">Durada</h2>
        <p className="text-sm font-bold text-start">{timeDuration || "No especificada"}</p>
      </div>

      <div className="w-full">
        <ButtonComponent
          className="my-5 w-full"
          type="button"
          variant="primary"
        >
          Apuntar-me
        </ButtonComponent>
      </div>
    </div>
  );
}

export default ProjectTeam;