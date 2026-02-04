import { useMemo } from "react";
import { useMinLoading } from "../../../hooks/useMinLoading";
import EmptyState from "../../ui/EmptyState";
import ProjectCard from "../projectCard/ProjectCard";
import CodeConnectCardSkeleton from "../CodeConnectCardSkeleton";
import { useProjects } from "../../../hooks/useProjectsCodeconnect";
import type { CodeConnectProject } from "../../../types/CodeConnectProjectTypes";

const ProjectList = ({
  onCardClick,
  filter,
}: {
  onCardClick?: (id: number) => void;
  filter?: string | null;
}) => {
  const { projects, isLoading, errorMessage } = useProjects(filter ?? null);
  const showLoader = useMinLoading(isLoading);

  const filteredProjects = useMemo(() => {
    if (!filter) return projects;

    const normalizedFilter = filter.toLowerCase();

    return projects.filter((project: CodeConnectProject) => {
      return (
        project.language_frontend.toLowerCase() === normalizedFilter ||
        project.language_backend.toLowerCase() === normalizedFilter
      );
    });
  }, [projects, filter]);

  const hasError = Boolean(errorMessage);

  return (
    <>
      <h2 className="text-2xl font-bold py-4 sm:py-6 text-black sm:mb-4">
        Llista de projectes
      </h2>

      {showLoader && !hasError && (
        <div className="grid justify-center ml-3 sm:ml-0 gap-1 sm:gap-10 grid-cols-[repeat(auto-fill,minmax(300px,1fr))] w-full">
          {Array.from({ length: 6 }).map((_, i) => (
            <CodeConnectCardSkeleton key={i} />
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
};

export default ProjectList;
