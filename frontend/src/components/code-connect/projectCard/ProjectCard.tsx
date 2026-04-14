import ProjectButton from "./ProjectButton";
import ProgressBar from "./ProgressBar";
import { resolveAsset } from "../../../utils/resolveAsset";
import GenericModal from "../../ui/Modal/GenericModal";
import avatarPlaceholder from "../../../assets/project-avatar3.jpg";
import type { ProjectCardProps } from "./types/projectTypes";
export type { Participant } from "./types/projectTypes";
import { Link } from "react-router";
import { useProjectJoin } from "./hooks/useProjectJoin";
import { useUserContext } from "../../../context/UserContext";

function ProjectCard({ project }: ProjectCardProps) {
  const { slots, joinModal, decisionModal } = useProjectJoin(project.id);
  const { user } = useUserContext();
  const userAvatar = user?.photoURL ?? avatarPlaceholder;

  const availableFrontend =
    project.frontend.positions - project.frontend.participants.length;
  const availableBackend =
    project.backend.positions - project.backend.participants.length;

  return (
    <article className="flex flex-col border scale-95 sm:scale-none border-gray-500 text-black items-center w-70 sm:w-76 xl:w-82 px-6 rounded-3xl py-7 pb-10">
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
          <img
            className="w-7"
            src={resolveAsset(project.frontend.logo)}
            alt={project.frontend.tech}
          />
        </div>
        <div className="flex w-full gap-2 mb-4">
          <div className="w-full grid grid-cols-3 gap-2 justify-items-start">
            {project.frontend.participants.map((p, i) => (
              <figure className="flex flex-col items-center" key={i}>
                <img
                  className="w-12 h-12"
                  src={resolveAsset(p.avatar)}
                  alt={p.name}
                />
                <figcaption className="text-xs mt-1 font-bold text-gray-500">
                  {p.name}
                </figcaption>
              </figure>
            ))}
            {[...Array(availableFrontend)].map((_, i) => {
              const index = project.frontend.participants.length + i;
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
                        src={userAvatar}
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
        </div>

        <div className="flex w-full items-center gap-4 mb-4">
          <h3 className="text-sm font-bold">Backend</h3>
          <img
            className="w-7"
            src={resolveAsset(project.backend.logo)}
            alt={project.backend.tech}
          />
        </div>
        <div className="flex w-full gap-2">
          <div className="w-full grid grid-cols-3 gap-2 justify-items-start">
            {project.backend.participants.map((p, i) => (
              <figure className="flex flex-col items-center" key={i}>
                <img
                  className="w-12 h-12"
                  src={resolveAsset(p.avatar)}
                  alt={p.name}
                />
                <figcaption className="text-xs mt-1 font-bold text-gray-500">
                  {p.name}
                </figcaption>
              </figure>
            ))}
            {[...Array(availableBackend)].map((_, i) => {
              const index = project.backend.participants.length + i;
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
                        src={userAvatar}
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
      </div>

      <div className="w-full mt-10">
        <h2 className="font-extrabold text-xl text-start mb-4">
          Termini d'inscripció
        </h2>
        <ProgressBar
          title="Progrés del projecte"
          startDate={project.startDate}
          endDate={project.endDate}
        />
      </div>

      <div className="w-full mt-10">
        <h2 className="font-extrabold text-xl text-start mb-4">Durada</h2>
        <p className="text-sm font-bold text-start">
          {project.duration || "No especificada"}
        </p>
      </div>

      <div className="w-full">
        <button className="my-5 w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition cursor-pointer font-bold">
          Apuntar-me
        </button>
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
}

export default ProjectCard;
