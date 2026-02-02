import ProjectCard from "../projectCard/ProjectCard";
import type { Project } from "../projectCard/types/projectTypes";
import { useProjects } from "../../../hooks/useProjectsCodeconnect";

type ProjectProps = {
  onCardClick?: (id: number) => void;
  filter?: string | null;
};

const ProjectList = ({ onCardClick, filter }: ProjectProps) => {
  const { projects, isLoading, errorMessage } = useProjects(filter);

  const filteredProjects = (projects as Project[]).filter((project) => {
    if (!filter) return true;

    const normalizedFilter = filter.toLowerCase();

    return (
      project.frontend?.tech?.toLowerCase() === normalizedFilter ||
      project.backend?.tech?.toLowerCase() === normalizedFilter
    );
  });

  return (
    <>
      <h2 className="text-2xl font-bold  py-4 sm:py-6 text-black sm:mb-4">
        Llista de projectess
      </h2>

      {isLoading && <p className="text-black py-3">Carregant projectes...</p>}

      {!isLoading && errorMessage && (
        <p className="text-black py-3">
          Error carregant projectes: {errorMessage}
        </p>
      )}

      {!isLoading && !errorMessage && filteredProjects.length === 0 && (
        <p className="text-black py-3">No hi ha projectes disponibles.</p>
      )}

      <section className="grid justify-center ml-3 sm:ml-0 gap-1 sm:gap-10 grid-cols-[repeat(auto-fill,minmax(300px,1fr))] w-full">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={onCardClick}
          />
        ))}
      </section>
    </>
  );
};

export default ProjectList;
