import { useEffect, useState } from "react";
import { useMinLoading } from "../../../hooks/useMinLoading";
import projectsData from "../../../moock/projects.json";
import type { Project } from "../projectCard/types/projectTypes";
import ProjectListUI from "./ProjectListUI";

function ProjectList({
  onCardClick,
  filter,
}: {
  onCardClick?: (id: number) => void;
  filter?: string | null;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const error = null;
  const showLoader = useMinLoading(isLoading);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const projectsToShow = (projectsData as Project[])
      .filter((p) => {
        if (!filter) return true;
        const f = filter.toLowerCase();
        return (
          p.frontend?.tech?.toLowerCase() === f ||
          p.backend?.tech?.toLowerCase() === f
        );
      });
    setProjects(projectsToShow);
    setIsLoading(false);
  }, [filter])


  return (
    <ProjectListUI
      projects={projects}
      showLoader={showLoader}
      error={error}
      onCardClick={onCardClick}
    />
  );
}

export default ProjectList;
