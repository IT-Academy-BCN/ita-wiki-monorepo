import GenericModal from "../../ui/Modal/GenericModal";
import ProgressBar from "./ProgressBar";
import TeamRow from "../TeamRow";
import { Link } from "react-router";
import { useProjectJoin } from "../../../hooks/useProjectJoin";
import { useProjectContributors } from "../../../hooks/useProjectContributors";

import ButtonComponent from "../../atoms/ButtonComponent";
import { displayLanguageIcon } from "../../../utils/iconUtils";

import type { ProjectCardProps } from "../../../types/CodeConnectProjectTypes";

const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  const { joinModal, decisionModal } = useProjectJoin(project.id);
  const { getTeamByRole } = useProjectContributors(project.contributors);

  const frontendTech = project.language_frontend;
  const backendTech = project.language_backend;

  const frontendImg = displayLanguageIcon(project.language_frontend);
  const backendImg = displayLanguageIcon(project.language_backend);

  const frontendTeam = getTeamByRole("frontend");
  const backendTeam = getTeamByRole("backend");

  const hardcodedStartDate = "2025-10-01";
  const hardcodedEndDate = "2025-11-13";

  const handleCardClick = (event: React.MouseEvent<HTMLElement>): void => {
    if (!onClick) return;

    const target = event.target as HTMLElement;

    if (target.closest("a,button")) return;

    onClick(project.id);
  };

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLElement>): void => {
    if (!onClick) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick(project.id);
    }
  };

  return (
    <article
      className="flex flex-col border scale-95 sm:scale-none border-gray-500 text-black items-center w-70 sm:w-76 xl:w-82 px-6 rounded-3xl py-7 pb-10"
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
    >
      <div className="w-full">
        <Link to={`/codeconnect/${project.id}`}>
          <h2 className="font-extrabold text-black w-fit hover:text-primary transition-colors duration-300 text-xl text-start">
            {project.title}
          </h2>
        </Link>
      </div>

      <div className="w-full mt-6">
        <h2 className="font-extrabold text-xl text-start mb-4">Equip</h2>

        <div className="flex w-full items-center gap-4 mb-4">
          <h3 className="text-sm font-bold">Frontend</h3>
          <img className="w-7" src={frontendImg} alt={frontendTech} />
        </div>

        <TeamRow
          members={frontendTeam.members}
          emptySlots={frontendTeam.emptySlots}
          slotIndexOffset={frontendTeam.members.length}
          onEmptySlotClick={(index) =>
            joinModal.open({
              area: "frontend",
              index,
              role: "Frontend Developer",
            })
          }
        />

        <div className="flex w-full items-center gap-4 mb-4">
          <h3 className="text-sm font-bold">Backend</h3>
          <img className="w-7" src={backendImg} alt={backendTech} />
        </div>

        <TeamRow
          members={backendTeam.members}
          emptySlots={backendTeam.emptySlots}
          slotIndexOffset={backendTeam.members.length}
          onEmptySlotClick={(index) =>
            joinModal.open({
              area: "backend",
              index,
              role: "Backend Developer",
            })
          }
        />
      </div>

      <div className="w-full mt-10">
        <h2 className="font-extrabold text-xl text-start mb-4">
          Termini d'inscripció
        </h2>
        <ProgressBar
          title="Progrés del projecte"
          startDate={hardcodedStartDate}
          endDate={hardcodedEndDate}
        />
      </div>

      <div className="w-full mt-10">
        <h2 className="font-extrabold text-xl text-start mb-4">Durada</h2>
        <p className="text-sm font-bold text-start">
          {project.time_duration || "No especificada"}
        </p>
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

      <GenericModal
        isOpen={joinModal.isOpen}
        onClose={joinModal.close}
        title="Unir-te al projecte"
        showPrimaryButton
        primaryButtonText={joinModal.isSubmitting ? "Enviant..." : "Confirmar"}
        primaryButtonAction={
          joinModal.isSubmitting ? undefined : joinModal.confirm
        }
        showSecondaryButton
        secondaryButtonText="Cancel·lar"
        secondaryButtonAction={joinModal.close}
      >
        <p>
          Vols unir-te com a {joinModal.selectedSlot?.role ?? "participant"} al
          projecte "{project.title}"?
        </p>
      </GenericModal>

      <GenericModal
        isOpen={decisionModal.isOpen}
        onClose={decisionModal.close}
        title="Gestionar contribuidor"
        showPrimaryButton
        primaryButtonText="Acceptar"
        primaryButtonAction={decisionModal.accept}
        showSecondaryButton
        secondaryButtonText="Rebutjar"
        secondaryButtonAction={decisionModal.reject}
      >
        <p>
          Vols acceptar o rebutjar aquest contribuidor pendent al projecte "
          {project.title}"?
        </p>
      </GenericModal>
    </article>
  );
};
export default ProjectCard;
