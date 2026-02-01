import { useState, useEffect } from "react";                                                                               
import projectsData from "../../../moock/projects.json";                                                                   
import { useMinLoading } from "../../../hooks/useMinLoading";                                                              
import ProjectListUI from "./ProjectListUI";                                                                               
import type { Project } from "../projectCard/types/projectTypes";                                                          
                                                                                                                             
  function ProjectList({                                                                                                     
    onCardClick,                                                                                                             
    filter,                                                                                                                  
  }: {                                                                                                                       
    onCardClick?: (id: number) => void;                                                                                      
    filter?: string | null;                                                                                                  
  }) {                                                                                                                       
    const [isLoading, setIsLoading] = useState(true);                                                                        
    const [error, setError] = useState<Error | null>(null);                                                                  
    const showLoader = useMinLoading(isLoading);                                                                             
                                                                                                                             
    useEffect(() => {                                                                                                        
      const timer = setTimeout(() => setIsLoading(false), 1500);                                                             
      return () => clearTimeout(timer);                                                                                      
    }, []);                                                                                                                  
                                                                                                                             
    const projects = (projectsData as Project[]).filter((p) => {                                                             
      if (!filter) return true;                                                                                              
      const f = filter.toLowerCase();                                                                                        
      return (                                                                                                               
        p.frontend?.tech?.toLowerCase() === f ||                                                                             
        p.backend?.tech?.toLowerCase() === f                                                                                 
      );                                                                                                                     
    });                                                                                                                      
                                                                                                                             
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