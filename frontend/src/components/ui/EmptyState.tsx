  import { FC } from "react";                                                                                                                                         
  import emptyImage from "../../assets/loading-png.png";
                                                                                                                                                                      
  interface EmptyStateProps {                                                                                                                                         
    text: string;                                                                                                                                                     
  }                                                                                                                                                                   
                                                                                                                                                                      
  const EmptyState: FC<EmptyStateProps> = ({ text }) => {                                                                                                             
    return (                                                                                                                                                          
      <div className="flex flex-col items-center mt-20">                                                                                                              
        <img src={emptyImage} alt="No hi ha dades" className="max-w-xs" />                                                                                            
        <h1 className="font-black">{text}</h1>                                                                                                                        
        <p className="text-gray-500 text-sm mt-2">                                                                                                                    
          Torna-ho a provar més tard o crea un nou element                                                                                                            
        </p>                                                                                                                                                          
      </div>                                                                                                                                                          
    );                                                                                                                                                                
  };                                                                                                                                                                  
                                                                                                                                                                      
  export default EmptyState;