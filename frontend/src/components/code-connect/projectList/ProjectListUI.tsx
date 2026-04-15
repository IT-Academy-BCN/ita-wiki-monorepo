import type { Project } from "../../../types/codeConnectTypes";
import ProjectCard from "../projectCard/ProjectCard";
import CodeConnectCardSkeleton from "../CodeConnectCardSkeleton";
import EmptyState from "../../ui/EmptyState";

interface ProjectListUIProps {
  projects: Project[];
  showLoader: boolean;
  error: Error | null;
  onCardClick?: (id: number) => void;
}

function ProjectListUI({
  projects,
  showLoader,
  error,
  onCardClick,
}: ProjectListUIProps) {
  return (
    <>
      <h2 className="text-2xl font-bold py-4 sm:py-6 text-black sm:mb-4">
        Llista de projectes
      </h2>
      {showLoader && !error && (
        <div
          className="grid justify-center ml-3 sm:ml-0 gap-1 sm:gap-10 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]   
  w-full"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <CodeConnectCardSkeleton key={i} />
          ))}
        </div>
      )}

      {error && (
        <EmptyState
          text="Error al obtenir projectes"
          subtext="Hi ha hagut un problema. Torna-ho a provar."
          textClassName="text-red-500"
        />
      )}

      {!showLoader && !error && projects.length === 0 && (
        <EmptyState
          text="No hi ha projectes"
          subtext="Torna-ho a provar més tard o crea un nou projecte"
        />
      )}

      {!showLoader && !error && projects.length > 0 && (
        <div
          className="grid justify-center ml-3 sm:ml-0 gap-1 sm:gap-10 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]   
  w-full"
        >
          {projects.map((project) => (
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

export default ProjectListUI;
