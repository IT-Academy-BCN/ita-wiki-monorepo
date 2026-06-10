import { useMemo } from "react";
import { useProjects } from "../../../hooks/useCodeConnectGetAllProjects";
import { useMinLoading } from "../../../hooks/useMinLoading";
import EmptyState from "../../ui/EmptyState";
import CodeConnectCardSkeleton from "../CodeConnectCardSkeleton";
import ProjectCard from "../projectCard/ProjectCard";

function ProjectList({
  onCardClick,
  filter,
  showMyProjects,
  userId,
}: {
  onCardClick?: (id: number) => void;
  filter?: string[] | null;
  showMyProjects?: boolean;
  userId?: number | null;
}) {
  const { projects, isLoading, errorMessage } = useProjects();
  const showLoader = useMinLoading(isLoading);

  const filteredProjects = useMemo(() => {
    if (showMyProjects && userId) {
      return projects.filter(project =>
        [...project.frontend.participants, ...project.backend.participants].some(
          participant => participant.user_id === userId && participant.status === "accepted"
        )
      );
    }
    if (!filter?.length) return projects;
    const normalizedFilter = filter.map((tech) => tech.toLowerCase());
    return projects.filter(
      (project) =>
        normalizedFilter.includes(project.frontend.tech.toLowerCase()) ||
        normalizedFilter.includes(project.backend.tech.toLowerCase()),
    );
  }, [projects, filter, showMyProjects, userId]);

  const hasError = Boolean(errorMessage);

  return (
    <>
      <h2 className="text-2xl font-bold py-4 sm:py-6 text-black sm:mb-4">
        Llista de projectes
      </h2>

      {showLoader && !hasError && (
        <div className="grid justify-center ml-3 sm:ml-0 gap-1 sm:gap-10 grid-cols-[repeat(auto-fill,minmax(300px,1fr))] w-full">
          {Array.from({ length: 6 }).map((_, index) => (
            <CodeConnectCardSkeleton key={index} />
          ))}
        </div>
      )}

      {hasError && (
        <EmptyState
          text="Error al obtenir projectes"
          subtext="Hi ha hagut un problema. Torna-ho a provar."
          textClassName="text-red-500"
        />
      )}

      {!showLoader && !hasError && filteredProjects.length === 0 && (
        <EmptyState
          text="No hi ha projectes"
          subtext="Torna-ho a provar més tard o crea un nou projecte"
        />
      )}

      {!showLoader && !hasError && filteredProjects.length > 0 && (
        <div className="grid justify-center ml-3 sm:ml-0 gap-1 sm:gap-10 grid-cols-[repeat(auto-fill,minmax(300px,1fr))] w-full">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={onCardClick}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default ProjectList;
