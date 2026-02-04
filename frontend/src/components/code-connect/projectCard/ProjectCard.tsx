import ProjectButton from "./ProjectButton";
import ProgressBar from "./ProgressBar";
import { resolveAsset } from "../../../utils/resolveAsset";
import GenericModal from "../../ui/Modal/GenericModal";
import avatarPlaceholder from "../../../assets/project-avatar3.jpg";
import { Link } from "react-router";
import { useProjectJoin } from "./hooks/useProjectJoin";
import type { CodeConnectProject } from "../../../types/CodeConnectProjectTypes";

const getTechLogo = (tech: string): string => {
  const normalizedTech = tech.trim().toLowerCase();

  if (normalizedTech === "react") return "../assets/react.svg";
  if (normalizedTech === "angular") return "../assets/angular.svg";
  if (normalizedTech === "php") return "../assets/logo-php 1.svg";
  if (normalizedTech === "java") return "../assets/logo-java 1.svg";
  if (normalizedTech === "python") return "../assets/logo-python.svg";
  if (normalizedTech === "javascript") return "../assets/javascript.svg";
  if (normalizedTech === "typescript") return "../assets/typescript.svg";

  return "../assets/react.svg";
};

const buildAvatarUrl = (name: string): string => {
  const encodedName = encodeURIComponent(name);
  return `https://ui-avatars.com/api/?name=${encodedName}&background=b91879&color=fff&rounded=true`;
};

const isRoleMatch = (programmingRole: string, keyword: string): boolean => {
  return programmingRole.toLowerCase().includes(keyword.toLowerCase());
};

type ProjectCardProps = {
  project: CodeConnectProject;
  onClick?: (id: number) => void;
};

const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  const { slots, joinModal, decisionModal } = useProjectJoin(project.id);

  const frontendTech = project.language_frontend;
  const backendTech = project.language_backend;

  const frontendLogo = getTechLogo(frontendTech);
  const backendLogo = getTechLogo(backendTech);

  const frontendPositions = 4;
  const backendPositions = 4;

  const frontendContributors = project.contributors.filter((c) =>
    isRoleMatch(c.programming_role, "front"),
  );

  const backendContributors = project.contributors.filter((c) =>
    isRoleMatch(c.programming_role, "back"),
  );

  const frontendParticipants = frontendContributors.map((c) => ({
    name: c.name,
    avatar: buildAvatarUrl(c.name),
  }));

  const backendParticipants = backendContributors.map((c) => ({
    name: c.name,
    avatar: buildAvatarUrl(c.name),
  }));

  const availableFrontend = Math.max(
    0,
    frontendPositions - frontendParticipants.length,
  );

  const availableBackend = Math.max(
    0,
    backendPositions - backendParticipants.length,
  );

  const hardcodedStartDate = "01-01-2026";
  const hardcodedEndDate = "12-31-2026";

  const handleCardClick = (event: React.MouseEvent<HTMLElement>): void => {
    if (!onClick) return;

    const target = event.target as HTMLElement;

    // Evitem disparar quan cliquem elements interactius dins la card
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
          <h1 className="font-extrabold text-black w-fit hover:text-primary transition-colors duration-300 text-xl text-start">
            {project.title}
          </h1>
        </Link>
        <p className="text-sm font-bold text-gray-500 text-start">
          Durada: {project.time_duration}
        </p>
      </div>

      <div className="flex w-full gap-4 mt-5">
        <div className="flex w-full items-center gap-3 sm:gap-4 xl:gap-6">
          <h2 className="text-sm font-bold">Frontend</h2>
          <img
            className="w-7"
            src={resolveAsset(frontendLogo)}
            alt={frontendTech}
          />
        </div>
        <div className="flex w-full items-center gap-3 sm:gap-5 xl:gap-7">
          <h2 className="text-sm font-bold">Backend</h2>
          <img
            className="w-7"
            src={resolveAsset(backendLogo)}
            alt={backendTech}
          />
        </div>
      </div>

      <div className="flex w-full gap-2 mt-4">
        <div className="w-full grid grid-cols-2 gap-4 grid-rows-2 border-r-2 pr-2 border-gray-200">
          {frontendParticipants.map((participant, i) => (
            <figure className="flex flex-col items-center" key={i}>
              <img
                className="w-12 h-12"
                src={resolveAsset(participant.avatar)}
                alt={participant.name}
              />
              <figcaption className="text-xs mt-1 font-bold text-gray-500">
                {participant.name}
              </figcaption>
            </figure>
          ))}

          {[...Array(availableFrontend)].map((_, i) => {
            const index = frontendParticipants.length + i;
            const pending = slots.isPending("frontend", index);
            const accepted = slots.isAccepted("frontend", index);

            if (pending) {
              return (
                <figure
                  key={`front-pending-${index}`}
                  className="flex flex-col items-center"
                  onClick={() => decisionModal.open("frontend", index)}
                >
                  <div
                    className={`w-12 h-12 rounded-full border-2 cursor-pointer overflow-hidden flex items-center justify-center ${accepted ? "border-transparent" : "border-orange-500"}`}
                  >
                    <img
                      className={`w-full h-full object-cover ${accepted ? "" : "grayscale"}`}
                      src={avatarPlaceholder}
                      alt="Pending contributor"
                    />
                  </div>
                  <figcaption className="text-xs mt-1 font-bold text-gray-500">
                    {accepted ? "Contributor" : "Pending"}
                  </figcaption>
                </figure>
              );
            }

            return (
              <ProjectButton
                key={`front-${index}`}
                onClick={() =>
                  joinModal.open({
                    area: "frontend",
                    index,
                    role: "Frontend Developer",
                  })
                }
              >
                +
              </ProjectButton>
            );
          })}
        </div>

        <div className="w-full grid grid-cols-2 justify-items-center grid-rows-2 pl-1 gap-4">
          {backendParticipants.map((participant, i) => (
            <figure className="flex flex-col items-center" key={i}>
              <img
                className="w-12 h-12"
                src={resolveAsset(participant.avatar)}
                alt={participant.name}
              />
              <figcaption className="text-xs mt-1 font-bold text-gray-500">
                {participant.name}
              </figcaption>
            </figure>
          ))}

          {[...Array(availableBackend)].map((_, i) => {
            const index = backendParticipants.length + i;
            const pending = slots.isPending("backend", index);
            const accepted = slots.isAccepted("backend", index);

            if (pending) {
              return (
                <figure
                  key={`back-pending-${index}`}
                  className="flex flex-col items-center"
                  onClick={() => decisionModal.open("backend", index)}
                >
                  <div
                    className={`w-12 h-12 rounded-full cursor-pointer border-2 overflow-hidden flex items-center justify-center ${accepted ? "border-transparent" : "border-orange-500"}`}
                  >
                    <img
                      className={`w-full h-full object-cover ${accepted ? "" : "grayscale"}`}
                      src={avatarPlaceholder}
                      alt="Pending contributor"
                    />
                  </div>
                  <figcaption className="text-xs mt-1 font-bold text-gray-500">
                    {accepted ? "Contributor" : "Pending"}
                  </figcaption>
                </figure>
              );
            }

            return (
              <ProjectButton
                key={`back-${index}`}
                onClick={() =>
                  joinModal.open({
                    area: "backend",
                    index,
                    role: "Backend Developer",
                  })
                }
              >
                +
              </ProjectButton>
            );
          })}
        </div>
      </div>

      <div className="w-full">
        <h2 className="text-sm mt-10 font-bold text-start mb-2">Inscripció</h2>
        <ProgressBar
          title="Progrés del projecte"
          startDate={hardcodedStartDate}
          endDate={hardcodedEndDate}
        />
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
