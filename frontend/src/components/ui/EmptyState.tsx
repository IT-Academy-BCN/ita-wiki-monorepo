  import { FC } from "react";                                                                                                                                         
  import emptyImage from "../../assets/loading-png.png";
  import clsx from "clsx";                                                                                                            
                                                                                                                                                                      
  interface EmptyStateProps {                                                                                                    
    text: string;                                                                                                                
    subtext?: string;                                                                                                            
    textClassName?: string;                                                                                                      
  }                                                                                                                                                                                           
                                                                                                                                                                      
  const EmptyState: FC<EmptyStateProps> = ({                                                                                     
    text,                                                                                                                        
    subtext,                                                                
    textClassName,                                                                                                               
  }) => {                                                
    return (                                                                                                                                                          
      <div className="flex flex-col items-center mt-20">                                                                                                              
        <img src={emptyImage} alt="No hi ha dades" className="max-w-xs" />                                                                                            
        <h1 className={clsx("font-black", textClassName)}>{text}</h1>                                                                                                                         
        {subtext && <p className="text-gray-500 text-sm mt-2">{subtext}</p>}                                                                                                                                                          
      </div>                                                                                                                                                          
    );                                                                                                                                                                
  };                                                                                                                                                                  
                                                                                                                                                                      
  export default EmptyState;