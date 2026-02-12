import { useParams } from "react-router";                                     
import { ResourcesFiltersProvider } from "../context/ResourcesFiltersContext";
import { useResources } from "../context/ResourcesContext";                   
import ResourcesHeader from "../components/resources/ResourcesHeader";
import { ResourcesList } from "../components/resources/ResourcesList";        
                                                                                
  const ResourcesPage = () => {                                                 
    const { category } = useParams();                                           
    const { resources } = useResources();                                       
                                                                                
    return (                                                                    
      <ResourcesFiltersProvider>                                                
        <div className="container mx-auto px-4 py-6">                           
          <h1 className="text-2xl font-bold mb-6">Recursos de programació</h1>  
          <ResourcesHeader initialCategory={category} />                        
          <ResourcesList resources={resources} category={category} />           
        </div>                                                                  
      </ResourcesFiltersProvider>                                               
    );                                                                          
  };                                                                            
                                                                                
  export default ResourcesPage;